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
  description: 'Ping pong',
  name: 'ping',
};

export const execute: SlashCommandExecute = context => ({
  type: 4,
  data: {
    content: `🏓 Pong! It took me \`${
      Date.now() - context.interactionHandlerStarted
    }ms\` to send you this message!`,
  },
});
