import { Context, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute = ({
  message,
  locale
}: Context): boolean | Promise<boolean> => {
  message.reply(interpolate(get("MEMBERCOUNT_TEXT"), { guild: message.guild.name, count: message.guild.memberCount }))
  return true;
};

export const meta: CommandMetadata = {
  name: 'membercount',
  description: 'Get the membercount of the server',
  accessLevel: 0,
  aliases: [],
  hidden: true,
};
