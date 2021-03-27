import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  name: 'areyoualive',
  description: 'good question',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'args',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};

export const execute: CommandExecute = ({ message }) =>
  message.channel.send('no').then(() => true);
