import { Client } from 'discord.js';
import { loggr } from '..';

export const execute = (client: Client, message: string | any): boolean => {
  loggr.debug(message);
  return true;
};
