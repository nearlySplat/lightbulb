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
