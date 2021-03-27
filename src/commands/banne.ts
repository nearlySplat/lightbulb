import { GuildMember } from 'discord.js';
import { CommandMetadata, CommandExecute } from '../types';
import { getMember } from '../util';
import { get, interpolate } from '../util/i18n';
export const execute: CommandExecute<'user'> = ({ message, args, locale }) => {
  const target =
    getMember(message.guild, args.data.user) ??
    ({ user: { tag: args.data.user } } as GuildMember);
  message.reply(
    interpolate(get('BANNE_SUCCESSFUL', locale), { target: target.user.tag })
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'banne',
  description: 'Banne a member!',
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
