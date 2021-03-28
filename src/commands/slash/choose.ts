/*
 * Copyright (C) 2020 Splaterxl
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
import { SlashCommandExecute } from '../../types';
import { CLIENT_COLOUR } from '../../constants';
let arr = [],
  obj = {
    one: 'first',
    two: 'second',
    three: 'third',
    four: '~th',
    five: 'fifth',
    six: '~th',
    seven: '~th',
    eight: '~th',
    nine: '~th',
    ten: 'last',
  };
const h = 'h'
  .repeat(10)
  .split('')
  .map((_, i) => i - 1);
for (const i of h) {
  if (i >= 0) {
    arr.push({
      type: 3,
      name: Object.keys(obj)[i],
      description: `The ${Object.values(obj)[i].replace(
        /^~/g,
        Object.keys(obj)[i]
      )} choice.${i === 9 ? " You can seperate more choices with ';'" : ''}`,
      required: i < 2,
    });
  }
}

export const meta = {
  name: 'choose',
  description: 'Choose between the supplied choices',
  options: arr,
};

export const execute: SlashCommandExecute = ({
  interaction: {
    data: { options },
  },
}) => {
  const args = options!.map(v => v.value);
  return {
    type: 4,
    data: {
      embeds: [
        {
          description: `I choose **${
            args[Math.floor(Math.random() * args.length)]
          }**!`,
          color: CLIENT_COLOUR,
          title: 'My choice',
          footer: { text: 'Ooh I like slash commands' },
        },
      ],
    },
  };
};
