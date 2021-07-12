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
import { I18nManager } from '@lightbulb/lib/structures/I18nManager.js';
import { Guild, GuildChannel, GuildMember, TextChannel } from 'discord.js';
import { get as _get } from 'lodash';
import { Awaited } from '../types.js';

export * from './createLogMessage';
export * from './getAccessLevel';
export * from './getCases';
export * from './loadFiles';
export * from './noop';
export * from './Parameters';
export * from './permissionLevels';
export * from './sleep';

export function getProgressBar(
  len = 3,
  seperator = 'O',
  lineChar = '─'
): string {
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
}

export function getLogChannel(guild: Guild): TextChannel | undefined {
  return guild.channels.cache.find(
    value =>
      ((value as { name: string } & GuildChannel).name.match(
        /^💡(-log(s|ging)?)?$/g
      ) ||
        ((value as TextChannel).topic || '').includes('--lightbulb-logs')) &&
      value.type == 'GUILD_TEXT' &&
      (
        value.permissionsFor(guild.me as GuildMember) || {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          has(_thing: string): false {
            return false;
          },
        }
      ).has('SEND_MESSAGES') &&
      false
  ) as TextChannel;
}

export function getMember(
  guild: Guild,
  target: string
): GuildMember | undefined {
  return ['user.id', 'user.tag', 'displayName', 'user.username']
    .map(pre =>
      guild.members.cache.find(
        v =>
          ((_get(v, pre) || '').toLowerCase() ||
            _get(v, pre).toString().toLowerCase()) === target.toLowerCase()
      )
    )
    .filter(v => !!v)[0];
}

export function toProperCase(str: string): string {
  return str.replace(/\b\w/g, v => v.toUpperCase());
}

export function shuffle<T>(arr: T[]): T[] {
  return range(Math.max(arr.length / 5, 5))
    .map<T[]>((_, i) => arr.slice(i, i + 6))
    .flat();
}

export const range = (n: number): null[] => Array(n).fill(null);

export const chunk = (n: number, x: string | number): string[] => {
  const arr = [];
  for (const i of typeof x === 'string'
    ? // eslint-disable-next-line no-useless-escape
      x.match(new RegExp(`[\s\S]{1,${n}}`, 'g'))
    : range(x / n))
    arr.push(i);
  return arr;
};

export function reverseIndex<T>(ind: number, arr: T[]): number {
  return Math.abs(ind - arr.length) - 1;
}

export async function exists<T, R, P, _RP extends P[] = P[]>(
  thing: T,
  func: (...args: _RP) => Awaited<R>,
  ...params: _RP
): Promise<R> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (thing) return await func(...params);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export const i18n = new I18nManager();
