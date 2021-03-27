import {
  ClientPresenceStatus,
  ClientPresenceStatusData,
  MessageEmbed,
} from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getMember, i18n } from '../util';

export const meta: CommandMetadata = {
  name: 'user',
  description: 'all the info on a user',
  accessLevel: 0,
  aliases: ['info', 'userinfo', 'ui'],
  params: [
    {
      name: 'target',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};
export const execute: CommandExecute<'target'> = async ({
  message,
  args,
  locale,
}) => {
  const member = getMember(
    message.guild,
    args.data.target ?? message.author.id
  );
  const user =
    member?.user ??
    (await message.client.users.fetch(
      args.data.target?.replace(/(^<@!?|>)/g, '') ?? message.author.id
    ));
  const embed = new MessageEmbed()
    .setColor(message.guild.me!.roles.highest.color)
    .setFooter(
      i18n.interpolate(i18n.get('GENERIC_REQUESTED_BY', locale), {
        requester: `${message.author.tag} (${message.author.id})`,
      })
    )
    .setThumbnail(user.avatarURL() as string)
    .setAuthor(`${user.tag} (${user.id})`)
    .addField(
      'User Information',
      `**Tag**: ${user.tag}
	      **ID**: ${user.id}
	      **Created at**: ${user.createdAt.toLocaleString()} (UNIX time: ${
        user.createdTimestamp
      })
	      **Account Type**: ${user.system ? 'System' : user.bot ? 'Bot' : 'Normal'}
	      **Status**: ${getBestPresence(
          user.presence.clientStatus as ClientPresenceStatusData
        )}`.replace(/\n[\t ]*/g, '\n'),
      true
    );
  message.channel.send(embed);
};

function getBestPresence(presence: ClientPresenceStatusData): string {
  return (
    ['online', 'dnd', 'idle', 'offline'].find(v =>
      Object.values(presence ?? {}).includes(v)
    ) ?? 'Offline'
  );
}
