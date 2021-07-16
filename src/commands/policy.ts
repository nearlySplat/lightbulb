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
import { CommandMetadata, CommandExecute } from '../types';

export const meta: CommandMetadata = {
  name: 'policy',
  description:
    "Sends the link for Lightbulb's Privacy Policy and Terms of Service",
  accessLevel: 0,
  aliases: ['privacy', 'terms', 'tos'],
};

export const execute: CommandExecute = () => [
  {
    content:
      'https://gist.github.com/nearlySplat/775c38ae157f5996e01ed4081d3f6380',
  },
  null,
];
