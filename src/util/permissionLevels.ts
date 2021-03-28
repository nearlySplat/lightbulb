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
import { Permissions } from 'discord.js';

export const permissionLevels: Record<string, bigint[]> = {
  Member: [Permissions.FLAGS.SEND_MESSAGES],
  Helper: [Permissions.FLAGS.KICK_MEMBERS],
  Moderator: [Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.MANAGE_MESSAGES],
  Manager: [Permissions.FLAGS.MANAGE_GUILD],
  Administrator: [Permissions.FLAGS.ADMINISTRATOR],
};

export const permissionLevelsArray: bigint[][] = Object.values(
  permissionLevels
);
export const permissionLevelsVerbose: string[] = Object.keys(permissionLevels);
