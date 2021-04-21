/*
 * Copyright (C) 2020 Splatterxl
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ClientPresenceStatusData, MessageEmbed } from 'discord.js';
import { User } from '../entity/User';
import { CommandExecute, CommandMetadata } from '../types';
import { getMember, i18n } from '../util';
import { formatPronouns } from './whataremypronouns';

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
      (await message.client.users
        .fetch(args.data.target?.replace(/(^<@!?|>)/g, '') ?? message.author.id)
        .catch(() => null)),
    lightbulbUserData = await User.findOne({
      where: {
        userid: user.id,
      },
    }).catch(() => null);
  if (!user) {
    message.channel.send('no such user could be found');
    return false;
  }
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
    )
    .addField(
      'Lightbulb-generated User Information',
      lightbulbUserData
        ? `**Developer**: ${!!lightbulbUserData.isDeveloper}
	      **Pronouns**: ${formatPronouns(lightbulbUserData.pronouns)}`.replace(
            /\n[\t\n ]*/g,
            '\n'
          )
        : 'None',
      true
    );
  message.channel.send(embed);
  return true;
};

function getBestPresence(presence: ClientPresenceStatusData): string {
  return (
    ['online', 'dnd', 'idle', 'offline'].find(v =>
      Object.values(presence ?? {}).includes(v)
    ) ?? 'Offline'
  );
}
