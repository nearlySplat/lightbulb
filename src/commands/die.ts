import { Context, CommandMetadata } from '../types';
export const execute = ({
  message,
  args,
}: Context): boolean | Promise<boolean> => {
  void message.reply(
    `cya o/`
  );
  setImmediate(() => process.exit())
  return true;
};

export const meta: CommandMetadata = {
  name: 'die',
  description: 'die',
  accessLevel: 6,
  aliases: [],
  hidden: true,
};
