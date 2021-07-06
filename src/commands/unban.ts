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
import { GuildBan, Permissions, Snowflake } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
import { config, ERROR_CODES } from '../constants';
import { User, IUser, DefaultPronouns } from '../models/User';
import { reloadBlacklists } from '../events/message';
export const execute: CommandExecute<'user' | 'reason'> = async ({
  message,
  args,
  locale,
}) => {
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args.data.user.replace(/(<@!?|>)/g, '') as Snowflake)
    .catch(() => null);
  if (!target) return false;
  let user = (await User.findOne({
      where: {
        userid: target.id,
      },
    }).exec()) ?? {
      pronouns: DefaultPronouns,
    };
  const { subject, singularOrPlural } = user.pronouns;
  const banInfo: GuildBan | null = await message.guild.bans
    .fetch(target.id)
    .catch(() => null);
  const unban = async () => {
    try {
      return await message.guild.members
        .unban(
          target.id,
          `[ ${message.author.tag} ]: ${
            args.data.reason || `No reason provided.`
          }`
        )
        .then(() => {
          void reloadBlacklists(message.client);
          return [
            {
              content:
                interpolate(get('UNBAN_SUCCESSFUL', locale), {
                  target: target.tag,
                  bannedFor: banInfo!.reason,
                  singular: (singularOrPlural === 'singular').toString(),
                  subject,
                }) +
                (message.guild.id === config.bot.support_server
                  ? '\nAdditionally, as this server is my support server, I have updated the blacklist.'
                  : ''),
            },
            null,
          ] as const;
        });
    } catch (e) {
      return [
        {
          content: interpolate(get('GENERIC_ERROR', locale), {
            code: ERROR_CODES.BAN_UNSUCCESSFUL.toString(),
            message: e,
          }),
        },
        null,
      ] as const;
    }
  };
  if (banInfo) {
    return unban();
  } else if (!banInfo) {
    return [
      {
        content: interpolate(get('GENERIC_ERROR', locale), {
          code: ERROR_CODES.UNBAN_NOT_BANNED.toString(),
          message: 'User is not banned from this guild.',
        }),
      },
      null,
    ] as const;
  }
};

export const meta: CommandMetadata = {
  name: 'unban',
  description: 'Unbans a user from the guild.',
  accessLevel: 2,
  aliases: [],
  hidden: false,
  params: [
    {
      name: 'user',
      type: 'string',
    },
    {
      name: 'reason',
      type: 'string',
      optional: true,
      rest: true,
    },
  ],
};
