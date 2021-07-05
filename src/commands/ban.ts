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
import { CommandExecute, CommandMetadata, CommandResponse } from '../types';
import { get, interpolate } from '../util/i18n';
import { config, ERROR_CODES, WHITELIST } from '../constants';
import { User } from '../models/User';
import { defaultDeleteButton, reloadBlacklists } from '../events/message';
export const execute: CommandExecute<'user' | 'reason'> = async ({
  message,
  args,
  locale,
  deleteButtonHandler,
}) => {
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args.data.user.replace(/(<@!?|>)/g, '') as Snowflake)
    .catch(() => null);
  if (!target) return false;
  let user: { objectPronoun: string };
  try {
    user = (await User.findOne({
      where: {
        userid: target.id,
      },
    }).catch(() => null)) || { objectPronoun: 'them' };
  } catch {
    user = { objectPronoun: 'them' };
  }
  const { objectPronoun } = user;
  const member = await message.guild.members.fetch(target.id).catch(() => null);
  const ban = async (): Promise<CommandResponse> => {
    return [
      {
        content: interpolate(get('BAN_CONFIRMATION', locale), {
          objectPronoun,
        }),
        components: [
          new MessageActionRow({
            components: [
              new MessageButton()
                .setLabel('Yes')
                .setCustomID('y')
                .setStyle('SUCCESS'),
              new MessageButton()
                .setLabel('No')
                .setCustomID('n')
                .setStyle('DANGER'),
            ],
          }),
        ],
      },
      async ctx => {
        if (ctx.user.id !== message.author.id) return { type: 6 };
        if (ctx.interaction.data.custom_id === 'internal__delete') {
          return deleteButtonHandler(ctx);
        }
        if (ctx.interaction.data.custom_id === 'n') {
          ctx.message.delete();
          message.delete().catch(() => {});
          return { type: 6 };
        }
        try {
          await message.guild.members.ban(target.id, {
            reason: `[ ${message.author.tag} ]: ${
              args.data.reason || `None provided`
            }`,
          });
          if (message.guild.id === config.bot.support_server) {
            void reloadBlacklists(message.client);
            ctx.message.edit({
              content:
                interpolate(get('BAN_SUCCESSFUL', locale), {
                  target: target.tag,
                }) +
                ' Additionally, as this is my support server, the blacklist has been updated.',
              components: defaultDeleteButton,
            });
          } else
            ctx.message.edit({
              content: interpolate(get('BAN_SUCCESSFUL', locale), {
                target: target.tag,
              }),
              components: defaultDeleteButton,
            });
        } catch (e) {
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
  if (member.user.id === message.guild.ownerID) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.TARGET_IS_OWNER.toString(),
        message: 'Target is owner',
      })
    );
    return false;
  }
  if (
    member.user.id === message.client.user.id ||
    WHITELIST.includes(target.id)
  ) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.DISALLOWED_TARGET.toString(),
        message: 'Disallowed target',
      })
    );
    return false;
  }
  if (member.user.id === message.author.id) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.SELF_IS_MODERATION_TARGET.toString(),
        message: 'Self is moderation target',
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
        interpolate(get('BAN_INSUFFICIENT_PERMISSIONS', locale), {
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
