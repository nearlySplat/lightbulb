import CatLoggr from 'cat-loggr/ts';
import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { loadFiles } from './util';
export const loggr = new CatLoggr();
export const commands = loadFiles('../commands');

const client = new Client({
  allowedMentions: { users: [], roles: [] },
  presence: {
    status: 'idle',
    activity: {
      name: 'moderation events',
      type: 'WATCHING',
    },
  },
  intents: [Intents.NON_PRIVILEGED],
});
config({
  path: join(__dirname, '..', '.env'),
});
loggr.debug('Loading events...');
readdirSync(join(__dirname, 'events'))
  .map(file => file.replace(/\.[jt]s$/, ''))
  .forEach(async file => {
    const { execute } = await import(join(__dirname, 'events', file));
    client.on(file, (...params) => execute(client, ...params));
    return loggr.debug(`Loaded event ${file}.`);
  });

client.login(process.env.TOKEN);
