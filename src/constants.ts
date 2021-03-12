import { Intents } from 'discord.js';

// TODO(nearlySplat): add more constants
export const PREFIXES = ['💡', '!',"bulb","pls"];
export const WHITELIST = ['728342296696979526'];
export const __prod__ = process.env.NODE_ENV === 'production';
export const INTENTS = [
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS
].reduce((prev, current) => prev + current);
export const CLIENT_COLOUR = 0xfcda7d;
export const ERROR_CODES = {
  BAN_UNSUCCESSFUL: 0,
  DISALLOWED_TARGET: 1,
  TARGET_IS_OWNER: 2,
  SELF_IS_MODERATION_TARGET: 3,
};
export const ERROR_MESSAGES = Object.keys(ERROR_CODES);
