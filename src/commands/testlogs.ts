import { Context, CommandMetadata } from '../types';
export const execute = ({ message }: Context): boolean | Promise<boolean> => {
  return true;
};

export const meta: CommandMetadata = {
  name: 'testlogs',
  description: 'Test the modlog',
  accessLevel: 2,
  aliases: [],
  hidden: true,
};
