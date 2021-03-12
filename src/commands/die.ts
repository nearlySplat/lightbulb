import { Context, CommandMetadata } from '../types';
import { get } from '../util/i18n';
export const execute = ({
  message,
  args,
  locale,
}: Context): boolean | Promise<boolean> => {
  void message.reply(get('DIE_SUCCESS', locale));
  setImmediate(() => process.exit());
  return true;
};

export const meta: CommandMetadata = {
  name: 'die',
  description: 'die',
  accessLevel: 3,
  aliases: [],
  hidden: true,
};
