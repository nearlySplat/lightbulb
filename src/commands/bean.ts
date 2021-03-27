import { GuildMember } from 'discord.js';
import { CommandMetadata, CommandExecute } from '../types';
import { getMember } from '../util';
import { get, interpolate } from '../util/i18n';
export const execute: CommandExecute<'user'> = ({ message, args, locale }) => {
  if (!args[0])
    return message.reply(get('BEAN_NO_TARGET', locale)).then(() => false);
  const target =
    getMember(message.guild, args.data.user) ??
    ({ user: { tag: args.data.user } } as GuildMember);
  message.reply(
    interpolate(get('BEAN_SUCCESSFUL', locale), { target: target.user.tag })
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'bean',
  description: '<:bean:813134247505559572>',
  accessLevel: 0,
  aliases: [],
  hidden: true,
  params: [
    {
      name: 'user',
      type: 'string',
      rest: true,
    },
  ],
};
