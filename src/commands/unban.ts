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
import { CommandExecute, CommandMetadata, CommandResponse } from '../types';
import { config, ERROR_CODES } from '../constants';
import { User, DefaultPronouns } from '../models/User';
import { reloadBlacklists } from '../events/messageCreate';
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
  const user = (await User.findOne({
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
  const unban = async (): Promise<CommandResponse> => {
    try {
      return await message.guild.members
        .unban(
          target.id,
          `[ ${message.author.tag} ]: ${
            args.data.reason || message.client.i18n.get('moderation.no_reason')
          }`
        )
        .then(() => {
          void reloadBlacklists(message.client);
          return [
            {
              content:
                message.client.i18n.get('unban.success', locale, {
                  target: target,
                  bannedFor: banInfo!.reason,
                }) +
                (message.guild.id === config.bot.support_server
                  ? message.client.i18n.get('moderation.blacklist')
                  : ''),
            },
            null,
          ] as const;
        });
    } catch (e) {
      return [
        {
          content: message.client.i18n.get('error.generic', locale, {
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
        content: message.client.i18n.get('error.generic', locale, {
          code: ERROR_CODES.UNBAN_NOT_BANNED.toString(),
          message: message.client.i18n.get('unban.not_banned'),
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
