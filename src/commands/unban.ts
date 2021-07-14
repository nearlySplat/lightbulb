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
import { config, ERROR_CODES } from '../constants';
import { reloadBlacklists } from '../events/messageCreate';
import { CommandExecute, CommandMetadata, CommandResponse } from '../types';
export const execute: CommandExecute<'user' | 'reason'> = async ({
  message,
  args,
  t,
}) => {
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args.data.user.replace(/(<@!?|>)/g, '') as Snowflake)
    .catch(() => null);
  if (!target) return false;
  const banInfo: GuildBan | null = await message.guild.bans
    .fetch(target.id)
    .catch(() => null);
  const unban = async (): Promise<CommandResponse> => {
    try {
      return await message.guild.members
        .unban(
          target.id,
          `[ ${message.author.tag} ]: ${
            args.data.reason || t('moderation.no_reason')
          }`
        )
        .then(() => {
          void reloadBlacklists(message.client);
          return [
            {
              content:
                t('unban.success', {
                  target: target,
                  bannedFor: banInfo!.reason,
                }) +
                (message.guild.id === config.bot.support_server
                  ? t('moderation.blacklist')
                  : ''),
            },
            null,
          ] as const;
        });
    } catch (e) {
      return [
        {
          content: t('error.generic', {
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
        content: t('error.generic', {
          code: ERROR_CODES.UNBAN_NOT_BANNED.toString(),
          message: t('unban.not_banned'),
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
