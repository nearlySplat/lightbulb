/*
 * Copyright (C) 2020 Splatterxl
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { NICKSUGGEST_WORDS } from '../constants.js';
import { CommandExecute, CommandMetadata } from '../types.js';

export const meta: CommandMetadata = {
  name: 'nicksuggestion',
  description: 'Suggests a nickname for you',
  aliases: ['nicksuggest', 'nick'],
  accessLevel: 0,
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
  let thing =
    NICKSUGGEST_WORDS.thing[
      Math.floor(Math.random() * NICKSUGGEST_WORDS.thing.length)
    ];
  if (ly.includes(adj)) thing = ed;
  return [adj, thing];
}
export const execute: CommandExecute = ctx => {
  const [adj, thing] = generateNick();
  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Reload')
        .setStyle('PRIMARY')
        .setCustomId('r')
    ),
  ];
  if (ctx.message.member.manageable)
    components[0].components.unshift(
      new MessageButton().setLabel('Apply').setCustomId('a').setStyle('SUCCESS')
    );
  return [
    {
      content: ctx.t('nicksuggestion'),
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
            content: ctx.t('generic.unauthorized'),
            flags: 64,
          },
        };
      switch (buttonCTX.customID) {
        case 'internal__hide':
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
