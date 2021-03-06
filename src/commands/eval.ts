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
import { MessageActionRow, MessageButton } from 'discord.js';
import { inspect } from 'util';
import { WHITELIST } from '../constants';
import { defaultDeleteButton } from '../events/messageCreate';
import { CommandExecute, CommandMetadata, CommandResponse } from '../types';
export const execute: CommandExecute = async ({
  message,
  args,
  deleteButtonHandler,
}) => {
  if (!WHITELIST.includes(message.author.id)) return true;
  const raw = args.join(' ');
  let output: unknown;
  try {
    output = eval(raw);
  } catch (error) {
    output = error;
  }
  let type = '';
  if (output instanceof Promise) {
    type = 'Promise';
    output = await output;
  }
  if (
    Array.isArray(output) &&
    output.length === 2 &&
    typeof output[0] === 'object' &&
    (output[1] instanceof Function || output[1] === null)
  )
    return output as CommandResponse;
  const strOutput =
    typeof output === 'string'
      ? output
      : inspect(output, {
          depth: 0,
        });
  const pages = strOutput.match(/[\s\S]{1,1850}/gi) || ['undefined'];
  const mobile = !!message.guild.presences.cache.get(message.author.id)
    .clientStatus.mobile;
  const getPage = (i: number) => ({
    content: `\`\`\`${mobile ? 'py' : 'js'}\n${
      type === 'Promise'
        ? 'Promise {\n' +
          pages[i]
            .split('\n')
            .map((v: string) => '  ' + v)
            .join('\n') +
          '\n}'
        : pages[i]
    }\n\`\`\``,
  });
  let currI = 0;
  return [
    {
      ...getPage(currI),
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setEmoji('cutie_backward:848237448269135924')
            .setStyle('PRIMARY')
            .setCustomId('<-'),
          defaultDeleteButton[0].components[0],
          new MessageButton()
            .setEmoji('cutie_forward:848237230363246612')
            .setStyle('PRIMARY')
            .setCustomId('->')
        ),
      ],
    },
    ctx => {
      const customID = ctx.interaction.data.custom_id;
      if (['internal__delete', 'internal__hide'].includes(ctx.customID))
        return deleteButtonHandler(ctx);
      else {
        switch (customID) {
          case '->': {
            if (currI === pages.length - 1) break;
            ctx.message.edit(getPage(++currI));
            break;
          }
          case '<-': {
            if (currI === 0) break;
            ctx.message.edit(getPage(--currI));
            break;
          }
        }
      }
      return { type: 6 };
    },
  ];
};

export const meta: CommandMetadata = {
  name: 'eval',
  description: 'Evaluate JavaScript code.',
  accessLevel: 3,
  aliases: [],
  params: [
    {
      name: 'code',
      type: 'string',
      rest: true,
    },
  ],
};
