import { Permissions } from "discord.js";
import { CommandExecute, CommandMetadata } from "../types";
import { getCases } from "../util";
import { get, interpolate } from "../util/i18n";
export const execute: CommandExecute = async ({ message, args, locale }) => {
  if (!args[0]) return false;
  if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args[0].replace(/(<@!?|>)/g, ""))
    .catch(() => null);
  if (!target) return false;
  const member = await message.guild.members.fetch(target.id).catch(() => null);
  const ban = async () => {
    try {
      await message.guild.members
        .ban(target.id, {
          reason: `[ ${message.author.tag} ]: ${
            args.slice(1).join(" ") ||
            `*responsible moderator, do \`reason ${await getCases(message.guild) + 1} <reason>\`*`
          }`,
        })
        .then(() => {
          message.channel.send(get("BAN_SUCCESSFUL", locale));
        });
    } catch {
      message.channel.send(
        interpolate(get("GENERIC_ERROR", locale), {
          code: "1 [BAN_UNSUCCESSFUL]",
        })
      );
    }
  };
  if (!member) {
    ban();
  }
  if (member)
    if (
      !member.manageable ||
      member.roles.highest.rawPosition >=
        message.member.roles.highest.rawPosition
    ) {
      message.channel.send(
        `One of us has insufficient permissions to ban \`${member.user.tag}\`.`
      );
      return false;
    } else {
      ban();
    }
  return true;
};

export const meta: CommandMetadata = {
  name: "ban",
  description: "Bans a member from the guild.",
  accessLevel: 2,
  aliases: [],
  hidden: false,
};
