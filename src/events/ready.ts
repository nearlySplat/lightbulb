import { Client } from 'discord.js';
import { loggr } from '..';

export const execute = (client: Client): boolean => {
  loggr.info(`Logged in as ${client.user?.tag}!`);
  return true;
};
