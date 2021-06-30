import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { NICKSUGGEST_WORDS } from '../constants.js';
import { defaultDeleteButton } from '../events/message.js';
import { CommandExecute, CommandMetadata } from '../types.js';

export const meta: CommandMetadata = {
  name: 'nicksuggestion',
  description: 'Suggests a nickname for you',
  aliases: ['nicksuggest', 'nick'],
  accessLevel: 0,
  // j: true
};
export function generateNick(): [string, string] {
  const ly =
    NICKSUGGEST_WORDS.ly[
      Math.floor(Math.random() * NICKSUGGEST_WORDS.ly.length)
    ];
  const ed =
    NICKSUGGEST_WORDS.ed[
      Math.floor(Math.random() * NICKSUGGEST_WORDS.ed.length)
    ];
  const adj = [ly, ed][Math.floor(Math.random() * 2)];
  const thing =
    NICKSUGGEST_WORDS.thing[
      Math.floor(Math.random() * NICKSUGGEST_WORDS.thing.length)
    ];
  return [adj, thing];
}
export const execute: CommandExecute = ctx => {
  const [adj, thing] = generateNick();
  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Reload')
        .setStyle('PRIMARY')
        .setCustomID('r')
    ),
    ...defaultDeleteButton,
  ];
  if (ctx.message.member.manageable)
    components[0].components.unshift(
      new MessageButton().setLabel('Apply').setCustomID('a').setStyle('SUCCESS')
    );
  return [
    {
      content: 'My suggestion is...',
      embed: new MessageEmbed({
        color: ctx.message.guild.me.roles.color.color,
        description: adj + thing,
      }),
      components,
    },
    buttonCTX => {
      if (buttonCTX.user.id !== ctx.message.author.id)
        return {
          type: 4,
          data: {
            content: "You can't do that!",
            flags: 64,
          },
        };
      switch (buttonCTX.customID) {
        case 'internal__delete': {
          return ctx.deleteButtonHandler(buttonCTX);
        }
        case 'r': {
          buttonCTX.message.edit({
            embeds: [
              new MessageEmbed()
                .setColor(buttonCTX.guild.me.roles.color.color)
                .setDescription(generateNick().join('')),
            ],
          });
          return { type: 6 };
        }
        case 'a': {
          ctx.message.member.setNickname(
            buttonCTX.message.embeds[0].description
          );
        }
      }
    },
  ];
};
