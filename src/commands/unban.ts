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
import { ERROR_CODES } from '../constants';
export const execute: CommandExecute = async ({ message, args, locale }) => {
  if (!args[0]) return false;
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args[0].replace(/(<@!?|>)/g, ''))
    .catch(() => null);
  if (!target) return false;
  const banInfo = await message.guild.fetchBan(target.id).catch(() => null);
  const unban = async () => {
    try {
      await message.guild.members
        .unban(
          target.id,
          `[ ${message.author.tag} ]: ${
            args.slice(1).join(' ') || `No reason provided.`
          }`
        )
        .then(() => {
          message.channel.send(
            interpolate(get('UNBAN_SUCCESSFUL', locale), {
              target: target.tag,
              bannedFor: banInfo!.reason,
            })
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
  if (banInfo) {
    unban();
  } else if (!banInfo) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.UNBAN_NOT_BANNED.toString(),
        message: 'Target is not banned from the guild',
      })
    );
    return false;
  }
  return true;
};

export const meta: CommandMetadata = {
  name: 'unban',
  description: 'Unbans a user from the guild.',
  accessLevel: 2,
  aliases: [],
  hidden: false,
};
