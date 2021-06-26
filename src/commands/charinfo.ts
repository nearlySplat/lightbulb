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
import axios from 'axios';
import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  name: 'charinfo',
  description: 'Get information about a Unicode character',
  aliases: ['utf'],
  params: [
    {
      name: 'chars',
      rest: true,
      type: 'string',
    },
  ],
  accessLevel: 0,
};

export const execute: CommandExecute<'chars'> = async ({
  message,
  args,
}): Promise<bool> => {
  let arr: string[] = [];
  const m = await message.channel.send('<a:loading:833416988981723147>');
  for (const str of args.data.chars.split('')) {
    const req = await axios.get<{
      name: string;
      fullname: string;
      code: string;
      char: typeof str;
      url: string;
    }>('http://localhost:5432/info?char=' + str.charCodeAt(0).toString(16));
    if (req.status !== 200) {
      arr.push('An error occurred.');
      break;
    }
    arr.push(
      `\`U+${req.data.code}\` ${req.data.name.replace(
        / \(U\+[\da-fA-F]+\)$/g,
        ''
      )} - ${req.data.char} — <${req.data.url}>`
    );
  }
  m.edit(
    arr.join('\n').length >= 2000
      ? 'Too long to display. Try again with fewer characters.'
      : arr.join("\n")
  );
  return true;
};

export type bool = true | false;
