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
import { CommandExecute, CommandMetadata } from '../types';

export const execute: CommandExecute = ({ message }) =>
  message.channel.send('corn').then(() => true);
export const meta: CommandMetadata = {
  name: 'guava',
  description: 'corn',
  accessLevel: 'ADMINISTRATOR',
  aliases: [],
  params: [
    {
      name: 'corn',
      type: 'string',
      options: ['corn'],
      optional: true,
    },
  ],
};
