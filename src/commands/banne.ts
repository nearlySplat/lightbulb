import { GuildMember } from 'discord.js';
import { Context, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute = ({
  message,
  args,
  locale
}: Context): boolean | Promise<boolean> => {
  if (!args[0])
    return message
      .reply(get('BANNE_NO_TARGET', locale))
      .then(() => false);
  const target: GuildMember =
    message.guild?.members.cache.get(args[0]?.replace(/(<@!?|>)/g, '')) ??
    message.guild?.members.cache.find(
      v =>
        v.user.username.toLowerCase() == args.join(' ').toLowerCase() ||
        v.user.tag.toLowerCase() === args.join(' ').toLowerCase() ||
        v.displayName.toLowerCase() == args.join(' ').toLowerCase()
    ) ??
    message.member;
  message.reply(interpolate(get('BANNE_SUCCESSFUL', locale), { target: target.user.tag }));
  return true;
};

export const meta: CommandMetadata = {
  name: 'banne',
  description: 'Banne a member!',
  accessLevel: 0,
  aliases: [],
  hidden: true,
};
