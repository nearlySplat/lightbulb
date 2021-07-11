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
import { Intents } from 'discord.js';
import { parse } from 'yaml';
import { readFileSync as readFile } from 'fs';
import { join } from 'path';
import { YAMLConfig } from './types';
import { add } from 'lodash';
import child_process from 'child_process';

export const config = parse(
  readFile(join(__dirname, '..', '..', 'etc', 'config.yml'), 'utf8')
) as YAMLConfig;

export const PREFIXES = Array.isArray(config.bot.prefix)
  ? config.bot.prefix
  : [config.bot.prefix];
export const WHITELIST = [...(config.whitelist || config.owner.id)];
export const __prod__ = process.env.NODE_ENV === 'production';
export const INTENTS = /*[
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_PRESENCES,
].reduce((prev, current) => prev + current);*/ Object.values(
  Intents.FLAGS
).reduce(add);
export const CLIENT_COLOUR = 0xfcda7d;
export const ERROR_MESSAGES = [
  'BAN_UNSUCCESSFUL',
  'DISALLOWED_TARGET',
  'TARGET_IS_OWNER',
  'SELF_IS_MODERATION_TARGET',
  'UNBAN_UNSUCCESSFUL',
  'UNBAN_NOT_BANNED',
];
export const generateErrorCode = (m: string): number =>
  m
    .split('')
    .map(v => v.charCodeAt(0))
    .reduce(add);
export const ERROR_CODES = Object.fromEntries(
  ERROR_MESSAGES.map(v => [v, generateErrorCode(v)])
);
export const PAGINATION_REACTIONS = ['⬅️', '◀️', '⏹', '▶️', '➡️'];
export const NICKSUGGEST_WORDS = {
  ly: [
    'Securely',
    'Constantly',
    'Clearly',
    'Likely',
    'Hardly',
    'Easily',
    'Friendly',
    'Kindly',
  ],
  ed: [
    'Energized',
    'Powered',
    'Unpowered',
    'Transferred',
    'Dragged',
    'Tooled',
    'Looted',
    'Tricked',
    'Abstracted',
    'Cheated',
    'Materialized',
    'Jailed',
    'Deleted',
    'Recoveried',
    'Obfuscated',
  ],
  thing: [
    'Parakeet',
    'Ghost',
    'Account',
    'Bird',
    'Neko',
    'Cookie',
    'Code',
    'Keyboard',
    'Block',
    'Sector',
    'Furry',
    'Femboy',
    'Biscuit',
    'Moderator',
    'Administrator',
  ],
};

export const COMMIT = child_process
  .execSync('git log -n 1 --format="%H"')
  .toString();
