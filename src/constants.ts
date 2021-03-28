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
import { Intents } from 'discord.js';

// TODO(nearlySplat): add more constants
export const PREFIXES = ['💡', 'bulb', 'pls'];
export const WHITELIST = ['728342296696979526', '606279329844035594'];
export const __prod__ = process.env.NODE_ENV === 'production';
export const INTENTS = [
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_PRESENCES,
].reduce((prev, current) => prev + current);
export const CLIENT_COLOUR = 0xfcda7d;
export enum ERROR_CODES {
  BAN_UNSUCCESSFUL,
  DISALLOWED_TARGET,
  TARGET_IS_OWNER,
  SELF_IS_MODERATION_TARGET,
  UNBAN_UNSUCCESSFUL,
  UNBAN_NOT_BANNED,
}
export const ERROR_MESSAGES = Object.keys(ERROR_CODES);
export const PAGINATION_REACTIONS = ['⬅️', '◀️', '⏹', '▶️', '➡️'];
