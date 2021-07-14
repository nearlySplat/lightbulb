/* eslint-disable @typescript-eslint/no-empty-function */
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
import {
  MessageActionRow,
  MessageButton,
  Permissions,
  Snowflake,
} from 'discord.js';
import { config, ERROR_CODES, WHITELIST } from '../constants';
import { defaultDeleteButton, reloadBlacklists } from '../events/messageCreate';
import { CommandExecute, CommandMetadata, CommandResponse } from '../types';
export const execute: CommandExecute<'user' | 'reason'> = async ({
  message,
  args,
  t,
  deleteButtonHandler,
}) => {
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args.data.user.replace(/(<@!?|>)/g, '') as Snowflake)
    .catch(() => {
      // do nothing
    });
  if (!target) return false;
  const member = await message.guild.members.fetch(target.id).catch(() => null);
  const ban = async (): Promise<CommandResponse> => {
    return [
      {
        content: t('ban.confirmation', {
          target,
        }),
        components: [
          new MessageActionRow({
            components: [
              new MessageButton()
                .setLabel('Yes')
                .setCustomId('y')
                .setStyle('SUCCESS'),
              new MessageButton()
                .setLabel('No')
                .setCustomId('n')
                .setStyle('DANGER'),
            ],
          }),
        ],
      },
      async ctx => {
        if (ctx.user.id !== message.author.id) return { type: 6 };
        if (['internal__delete', 'internal__hide'].includes(ctx.customID)) {
          return deleteButtonHandler(ctx);
        }
        if (ctx.interaction.data.custom_id === 'n') {
          ctx.message.delete();
          message.delete().catch(() => {
            // do nothing
          });
          return { type: 6 };
        }
        try {
          await message.guild.members.ban(target.id, {
            reason: `[ ${message.author.tag} ]: ${
              args.data.reason || t('moderation.no_reason')
            }`,
          });
          if (message.guild.id === config.bot.support_server) {
            void reloadBlacklists(message.client);
            ctx.message.edit({
              content:
                t('ban.success', {
                  target,
                }) + t('ban.blacklist'),
              components: defaultDeleteButton,
            });
          } else
            ctx.message.edit({
              content: t('ban.success', {
                target,
              }),
              components: defaultDeleteButton,
            });
        } catch (e) {
          ctx.client.sentry.captureException(e);
          ctx.message.edit({
            content: `\`\`\`${e}\`\`\``,
            components: defaultDeleteButton,
          });
          return { type: 6 };
        }
      },
    ];
  };
  if (!member) {
    return ban();
  }
  if (member.user.id === message.guild.ownerId) {
    message.channel.send(
      t('error.generic', {
        code: ERROR_CODES.TARGET_IS_OWNER.toString(),
        message: t('error.target_owner'),
      })
    );

    return false;
  }

  if (
    member.user.id === message.client.user.id ||
    WHITELIST.includes(target.id)
  ) {
    message.channel.send(
      t('error.generic', {
        code: ERROR_CODES.DISALLOWED_TARGET.toString(),
        message: t('error.disallowed_target'),
      })
    );
    return false;
  }
  if (member.user.id === message.author.id) {
    message.channel.send(
      t('error.generic', {
        code: ERROR_CODES.SELF_IS_MODERATION_TARGET.toString(),
        message: t('error.self_mod_target'),
      })
    );
    return false;
  }
  if (member)
    if (
      !member.manageable ||
      member.roles.highest.rawPosition >=
        message.member.roles.highest.rawPosition
    ) {
      message.channel.send(
        t('ban.noperms', {
          target: member.user.tag,
        })
      );
      return false;
    } else {
      return ban();
    }
};

export const meta: CommandMetadata = {
  name: 'ban',
  description: 'Bans a member from the guild.',
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
      rest: true,
      optional: true,
    },
  ],
};
