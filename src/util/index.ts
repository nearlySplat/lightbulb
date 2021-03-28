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
import { Guild, GuildMember, TextChannel } from 'discord.js';
import { get as _get } from 'lodash';

export * from './createLogMessage';
export * from './loadFiles';
export * from './noop';
export * from './permissionLevels';
export * from './sleep';
export * from './getCases';
export * from './getAccessLevel';
export * from './Parameters';
export const getProgressBar = (len = 3, seperator = 'O', lineChar = '─') => {
  if (typeof len !== 'number')
    throw new TypeError("Parameter 'len' must be of type number.");
  if (typeof seperator !== 'string')
    throw new TypeError("Parameter 'seperator' must be of type string");
  if (typeof lineChar !== 'string')
    throw new TypeError("Paramater 'lineChar' must be of type string.");
  const num = Math.floor(Math.random() * len);
  const progress = Array.from({ length: len }, (_, i) =>
    i === num ? seperator : lineChar
  ).join('');
  return progress;
};
export * as i18n from './i18n';
export * from './parseCLIArgs';
export const getLogChannel = (guild: Guild) =>
  guild.channels.cache.find(
    value =>
      ((value.name?.match(/^💡(-log(s|ging)?)?$/g) ||
        (value as TextChannel).topic?.includes('--lightbulb-logs')) &&
        value.type == 'text' &&
        value.permissionsFor(guild.me as GuildMember)?.has('SEND_MESSAGES')) ??
      false
  );

export const getMember = (guild: Guild, target: string) =>
  ['user.id', 'user.tag', 'displayName', 'user.username']
    .map(pre =>
      guild.members.cache.find(
        v =>
          (_get(v, pre).toLowerCase?.() ??
            _get(v, pre).toString().toLowerCase()) === target.toLowerCase()
      )
    )
    .filter(v => !!v)[0];

export const toProperCase = (str: string) =>
  str.replace(/\b\w/g, v => v.toUpperCase());
