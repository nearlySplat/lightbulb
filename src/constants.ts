import { Intents } from 'discord.js';

// TODO
export const PREFIXES = ['💡', '!'];
export const WHITELIST = ['728342296696979526'];
export const __prod__ = process.env.NODE_ENV === 'production';
export const INTENTS = [
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
].reduce((prev, current) => prev + current);
export const CLIENT_COLOUR = 0xfcda7d;
