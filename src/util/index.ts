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
import { Guild, GuildChannel, GuildMember, TextChannel } from 'discord.js';
import { get as _get } from 'lodash';

export * from './createLogMessage';
export * from './getAccessLevel';
export * from './getCases';
export * as i18n from './i18n';
export * from './loadFiles';
export * from './noop';
export * from './Parameters';
export * from './parseCLIArgs';
export * from './permissionLevels';
export * from './sleep';

export function getProgressBar(len = 3, seperator = 'O', lineChar = '─') {
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

export function getLogChannel(guild: Guild) {
  return guild.channels.cache.find(
    value =>
      ((value as { name: string } & GuildChannel).name.match(
        /^💡(-log(s|ging)?)?$/g
      ) ||
        ((value as TextChannel).topic || '').includes('--lightbulb-logs')) &&
      value.type == 'text' &&
      (
        value.permissionsFor(guild.me as GuildMember) || {
          has(_thing: string) {
            return false;
          },
        }
      ).has('SEND_MESSAGES') &&
      false
  );
}

export function getMember(guild: Guild, target: string) {
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

export function toProperCase(str: string) {
  return str.replace(/\b\w/g, v => v.toUpperCase());
}

export function shuffle<T>(arr: T[]) {
  return range(Math.max(arr.length / 5, 5))
    .map<T[]>((_, i) => arr.slice(i, i + 6))
    .flat();
}

export const range = (n: number) => Array(n).fill(null);

export const chunk = (n: number, x: string | number) => {
  let arr = [];
  for (const i of typeof x === 'string'
    ? x.match(new RegExp(`[\s\S]{1,${n}}`, 'g'))
    : range(x / n))
    arr.push(i);
  return arr;
};

export function reverseIndex(ind: number, arr: unknown[]) {
  return Math.abs(ind - arr.length) - 1;
}

namespace AST {
  export enum TokenTypes {
    Text,
    Block,
  }
  export interface Token {
    type: TokenTypes;
    value: Token[] | string;
    parent?: Token[];
  }
  export interface BlockToken extends Token {
    value: Token[];
  }
  export const START_OF_BLOCK = '{';
  export const END_OF_BLOCK = '}';
  export const INVAL_CHARS = [START_OF_BLOCK, END_OF_BLOCK];
  export const BaseTokens: Record<TokenTypes, Token> = {
    0: {
      type: TokenTypes.Text,
      value: '',
    },
    1: {
      type: TokenTypes.Block,
      value: [],
    },
  };
}

export function parseNewSyntaxThing(str: string) {
  let arr: AST.Token[] = [AST.BaseTokens[AST.TokenTypes.Text]];
  arr[0].parent = arr;
  let current = arr[0];
  for (const char of str) {
    if (
      current.type === AST.TokenTypes.Text &&
      typeof current.value === 'string'
    ) {
      if (!AST.INVAL_CHARS.includes(char)) current.value += char;
      else {
        if (char === AST.START_OF_BLOCK) {
          const ind =
            current.parent.push(AST.BaseTokens[AST.TokenTypes.Block]) - 1;
          const curr = current.parent[ind] as AST.BlockToken;
          curr.parent = arr;
          const newVInd =
            curr.value.push(AST.BaseTokens[AST.TokenTypes.Block]) - 1;
          curr.value[newVInd].parent = curr.value;
          current = curr;
        } else if (char === AST.END_OF_BLOCK) {
          const ind =
            current.parent.push(AST.BaseTokens[AST.TokenTypes.Text]) - 1;
          current = current.parent[ind];
        }
      }
    }
  }
  return arr;
}
