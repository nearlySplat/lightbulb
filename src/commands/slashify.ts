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
 import { CommandExecute, CommandMetadata } from '../types.js';

export const meta: CommandMetadata = {
  name: 'slashify',
  description:
    'replaces all characters in your text with / repeated by the Unicode character code of each letter',
  aliases: [],
  accessLevel: 0,
  params: [
    {
      name: 'text',
      type: 'string',
      rest: true,
    },
  ],
};

export const execute: CommandExecute = ctx => [
  {
    content: ctx.args.data.text.split('\n').every(v => !/[^\/ ]+/g.test(v))
      ? ctx.args.data.text
          .split('\n')
          .map(v =>
            v
              .split(' ')
              .map(v => String.fromCharCode(v.length))
              .join('')
          )
          .join('\n')
      : ctx.args.data.text
          .split(' ')
          .map(v =>
            v
              .split('')
              .map(v => '/'.repeat(v.charCodeAt(0)))
              .join(' ')
          )
          .join('\n'),
  },
  null,
];
