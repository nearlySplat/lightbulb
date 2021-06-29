/* eslint-disable no-undef */
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
import { SlashCommandExecute } from '../../types';

export const meta = {
  name: 'base64',
  description: 'Use base64 strings inside of Discord!',
  options: [
    {
      type: 1,
      name: 'encode',
      description: 'Encode to base64',
      options: [
        { type: 3, name: 'data', description: 'The data you want to encode.' },
      ],
    },
    {
      type: 1,
      name: 'decode',
      description: 'Decode from base64',
      options: [
        {
          type: 3,
          name: 'data',
          description: 'The data you want to decode.',
          required: true,
        },
      ],
    },
  ],
  accessLevel: 0,
};

export const execute: SlashCommandExecute = ctx => {
  return {
    type: 4,
    data: {
      flags: 64,
      content:
        ctx.interaction.data.options[0].name === 'encode'
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Buffer.from(ctx.interaction.data.options[0].options[0]).toString(
              'base64'
            )
          : Buffer.from(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ctx.interaction.data.options[0].options[0],
              'base64'
            ).toString(),
    },
  };
};
