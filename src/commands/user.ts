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
import { ClientPresenceStatusData, MessageEmbed, Snowflake } from 'discord.js';
import { User } from '../models/User';
import { CommandExecute, CommandMetadata } from '../types';
import { getMember, i18n } from '../util';
import { formatPronouns } from './whataremypronouns';
import { commands } from '..';
import moment from 'moment';

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
        .fetch(
          (args.data.target?.replace(/(^<@!?|>)/g, '') ??
            message.author.id) as Snowflake
        )
        .catch(() => null)),
    lightbulbUserData = await User.findOne({
      uid: user.id,
    }).exec();
  if (!user) {
    message.channel.send('no such user could be found');
    return false;
  }
  return [
    {
      embed: new MessageEmbed()
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
	      **Created at**: <t:${Math.floor(user.createdTimestamp / 1000)}> (${moment(
            user.createdTimestamp
          ).fromNow()})
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
	             **Pronouns**: ${formatPronouns(lightbulbUserData.pronouns)}
               **Commands used**: ${(
                 lightbulbUserData.commands.length / commands.size
               ).toFixed(2)}%
               **Achievements**: ${
                 lightbulbUserData.achievements.length
               }`.replace(/\n[\t\n ]*/g, '\n')
            : 'None',
          true
        ),
    },
    null,
  ];
};
export const statusEmojis: Record<string, string> = {
  offline: 'offline2:464520569929334784',
  online: 'online2:464520569975603200',
  dnd: 'dnd2:464520569560498197',
  idle: 'away2:464520569862357002',
  mobile: 'mobile:858031541375205396',
};
function getBestPresence(presence: ClientPresenceStatusData): string {
  let status =
    ['online', 'dnd', 'idle'].find(v => Object.values(presence).includes(v)) ||
    'offline';
  if (
    Object.entries(presence)
      .filter(([, v]) => v === status)
      .map(([v]) => v) === ['mobile']
  ) {
    status =
      `<:${statusEmojis.mobile}>` +
      `<:${statusEmojis[status]}//`.replace('\\/\\/', '');
  } else status = `<:${statusEmojis[status]}>`;
  return status;
}
