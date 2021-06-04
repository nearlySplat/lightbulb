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
import {
  CommandExecute,
  CommandMetadata,
  ComponentStyle,
  ComponentType,
} from '../types';
import { accessLevels } from '../util';

export const execute: CommandExecute = async () => {
  return [
    {
      content: 'hello gamers',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ComponentStyle.Success,
              label: 'I like buttons',
              custom_id: 'hello',
            },
          ],
        },
      ],
    },
    null,
  ];
};

export const meta: CommandMetadata = {
  name: 'tictactoe',
  description: 'Play Naughts and Crosses (Tic Tac Toe) with your friends!',
  accessLevel: accessLevels.OWNER,
  aliases: ['ttt'],
};
