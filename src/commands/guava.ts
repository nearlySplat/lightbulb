import { CommandExecute, CommandMetadata } from '../types';

export const execute: CommandExecute = ({ message }) =>
  message.channel.send('corn').then(() => true);
export const meta: CommandMetadata = {
  name: 'guava',
  description: 'corn',
  accessLevel: 'ADMINISTRATOR',
  aliases: [],
  params: [
    {
      name: 'corn',
      type: 'string',
      options: ['corn'],
      optional: true,
    },
  ],
};
