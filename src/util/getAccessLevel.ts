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
import { GuildMember, Permissions } from 'discord.js';
import { WHITELIST as whitelist } from '../constants';
import { AccessLevels } from '../types';
export const accessLevels = {
  USER: 0,
  MODERATOR: 1,
  ADMINISTRATOR: 2,
  OWNER: 3,
} as const;

export const getAccessLevel = (
  level: keyof AccessLevels | 0 | 1 | 2 | 3
): 0 | 1 | 2 | 3 => {
  if (typeof level === 'string') return accessLevels[level];
  else return Object.values(accessLevels)[level] ?? 0;
};

export const getCurrentLevel = (member: GuildMember): 0 | 1 | 2 | 3 => {
  if (whitelist.includes(member.user.id)) {
    return getAccessLevel('OWNER');
  } else if (
    [Permissions.FLAGS.ADMINISTRATOR].every(perm =>
      member.permissions.has(perm)
    )
  ) {
    return getAccessLevel('ADMINISTRATOR');
  } else if (
    [Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.KICK_MEMBERS].every(
      perm => member.permissions.has(perm)
    )
  )
    return getAccessLevel('MODERATOR');
  else return getAccessLevel('USER');
};
