/*
 * Copyright (C) 2020 Splaterxl
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
import { Permissions } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
import { ERROR_CODES, WHITELIST } from '../constants';
export const execute: CommandExecute<'user' | 'reason'> = async ({
  message,
  args,
  locale,
}) => {
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args.data.user.replace(/(<@!?|>)/g, ''))
    .catch(() => null);
  if (!target) return false;
  const member = await message.guild.members.fetch(target.id).catch(() => null);
  const ban = async () => {
    try {
      await message.guild.members
        .ban(target.id, {
          reason: `[ ${message.author.tag} ]: ${
            args.data.reason || `None provided`
          }`,
        })
        .then(() => {
          message.channel.send(
            interpolate(get('BAN_SUCCESSFUL', locale), { target: target.tag })
          );
        });
    } catch (e) {
      message.channel.send(
        interpolate(get('GENERIC_ERROR', locale), {
          code: ERROR_CODES.BAN_UNSUCCESSFUL.toString(),
          message: e,
        })
      );
    }
  };
  if (!member) {
    ban();
  }
  if (member?.user.id === message.guild.ownerID) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.TARGET_IS_OWNER.toString(),
        message: 'Target is owner',
      })
    );
    return false;
  }
  if (
    member?.user.id === message.client.user?.id ||
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
  if (member?.user.id === message.author.id) {
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
      ban();
    }
  return true;
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
