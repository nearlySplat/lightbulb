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
import { transpile } from 'typescript';
import { inspect } from 'util';
import { WHITELIST } from '../constants';
import { defaultDeleteButton } from '../events/message';
import { CommandExecute, CommandMetadata } from '../types';
export const execute: CommandExecute = async ({
  message,
  args,
  deleteButtonHandler,
}) => {
  if (!WHITELIST.includes(message.author.id)) return true;
  const raw = args.join(' ');
  let output: any;
  try {
    output = eval(raw);
  } catch (error) {
    output = error;
  }
  let type = '';
  if (output instanceof Promise) {
    output = await output;
    type = 'Promise';
  }
  let strOutput =
    typeof output === 'string'
      ? output
      : inspect(output, {
          depth: 0,
        });
  let pages = strOutput.match(/[\s\S]{1,1850}/gi) || ['undefined'];
  const mobile = !!message.author.presence.clientStatus.mobile;
  let getPage = (i: number) => ({
    content:
      type === 'Promise'
        ? 'Promise {\n' +
          strOutput[i]
            .split('\n')
            .map((v: string) => '  ' + v)
            .join('\n') +
          '\n}'
        : strOutput.slice(0, 1850),
    code: mobile ? 'py' : 'js',
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
            .setCustomID('<-'),
          defaultDeleteButton[0].components[0],
          new MessageButton()
            .setEmoji('cutie_forward:848237230363246612')
            .setStyle('PRIMARY')
            .setCustomID('->')
        ),
      ],
    },
    ctx => {
      const customID = ctx.interaction.data.custom_id;
      if (customID === 'internal__delete') return deleteButtonHandler(ctx);
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
