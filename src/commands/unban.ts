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
