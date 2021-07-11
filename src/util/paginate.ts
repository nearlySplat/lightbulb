// Copyright not applicable
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Snowflake,
} from 'discord.js';
import { defaultDeleteButton } from '../events/message.js';
import { ButtonInteractionHandler, CommandResponse } from '../types.js';
// written by bread, ported to ts by Splatterxl
export async function pagination(
  pages: {
    embed: MessageEmbed;
    label: string;
    description: string;
    emoji: string;
  }[],
  user: Snowflake
): Promise<CommandResponse> {
  let i = 0;
  const components = (disabled = false) => [
    new MessageActionRow().addComponents(
      defaultDeleteButton[0].components[0].setDisabled(disabled),
      new MessageButton()
        .setCustomId('p_prev')
        .setStyle('PRIMARY')
        .setEmoji('cutie_backward:848237448269135924')
        .setDisabled(pages.length === 1 || i === 0 || disabled),
      new MessageButton()
        .setCustomId('p_stop')
        .setStyle('DANGER')
        .setEmoji('cutie_stop:848633645123371038')
        .setDisabled(disabled),
      new MessageButton()
        .setCustomId('p_next')
        .setStyle('PRIMARY')
        .setEmoji('cutie_forward:848237230363246612')
        .setDisabled(pages.length === 1 || i === pages.length - 1 || disabled)
    ),
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .addOptions(
          pages.map((v, i) => {
            delete v.embed;
            return { ...v, value: `${i}` };
          })
        )
        .setDisabled(disabled)
        .setCustomId('p_page')
    ),
  ];
  const handle: ButtonInteractionHandler = ctx => {
    if (ctx.user.id !== user) return { type: 6 };
    switch (ctx.customID) {
      case 'internal__delete':
        ctx.message.delete();
        ctx.removeListener();
        break;
      case 'p_stop':
        ctx.message.edit({ components: components(true) });
        break;
      case 'p_prev':
        ctx.message.edit({
          embeds: [pages[--i].embed],
          components: components(),
        });
        break;
      case 'p_next':
        ctx.message.edit({
          embeds: [pages[++i].embed],
          components: components(),
        });
        break;
      case 'p_page':
        i = +ctx.interaction.data.values[0];
        console.log(ctx.interaction.data, i, !!pages[i]);
        ctx.message.edit({
          embeds: [pages[i].embed],
          components: components(),
        });
        break;
    }
    return { type: 6 };
  };
  return [{ embed: pages[i].embed, components: components() }, handle];
}
