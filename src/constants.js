import { Intents } from 'discord.js';
// TODO(nearlySplat): add more constants
export var PREFIXES = ['💡', 'bulb', 'pls'];
export var WHITELIST = ['728342296696979526', '606279329844035594'];
export var __prod__ = process.env.NODE_ENV === 'production';
export var INTENTS = [
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
].reduce(function (prev, current) {
  return prev + current;
});
export var CLIENT_COLOUR = 0xfcda7d;
export var ERROR_CODES = {
  BAN_UNSUCCESSFUL: 0,
  DISALLOWED_TARGET: 1,
  TARGET_IS_OWNER: 2,
  SELF_IS_MODERATION_TARGET: 3,
};
export var ERROR_MESSAGES = Object.keys(ERROR_CODES);
