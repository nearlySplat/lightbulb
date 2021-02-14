import {
  Client,
  Guild,
  GuildMember,
  Permissions,
  Snowflake,
  TextChannel,
  User,
} from "discord.js";
import { createLogMessage, getCases } from "../util";
import { CLIENT_COLOUR } from "../constants";
import { CommandExecute, CommandMetadata, Context } from "../types";

export const execute = async ({ message, args }: Context): Promise<any> => {
  if (
    !(message.guild as Guild).me?.permissions.has(
      Permissions.FLAGS.VIEW_AUDIT_LOG
    )
  )
    return;
  const channel = (message.guild as Guild).channels.cache.find(
      (value) =>
        (value.name?.match(/^💡(-log(s|ging)?)?$/g) &&
          value.type == "text" &&
          value
            .permissionsFor((message.guild as Guild).me as GuildMember)
            ?.has("SEND_MESSAGES")) ??
        false
    ) as TextChannel,
    auditLogs = await (message.guild as Guild).fetchAuditLogs();
  await channel.messages.fetch({});
  const message1 = args[0] == "l" ? channel?.messages.cache.filter(v => v.author.id === message.client.user?.id).map(v => v).sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0] : channel?.messages.cache.find((v) =>
    v.content.startsWith(`\`[Case ${args[0]}]\``) && v.author.id === message.client.user?.id
  );
  if (!message1) return message.react("😔");
  const matchedUser = message1.content
    .match(/ed]` \*\*[^#]+#\d{4}\*\* \(\d+\)/g)?.[0]
    ?.match(/\d{4}\d+/g)?.[0];
  const user = await message.client.users
    ?.fetch(`${matchedUser}`)
    .catch(() => null);
  if (!user) return message.react("😔");
  const auditLogEntry = auditLogs.entries.find(
    (value) =>
      value.action == "MEMBER_BAN_ADD" &&
      (value.target as { id: Snowflake })?.id === user.id
  );
  if (!auditLogEntry) return false;
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes("--compact"),
      victim: {
        tag: user.tag,
        id: user.id,
      },
      perpetrator: {
        id: message.author.id,
        tag: message.author.tag,
      },
      reason: args.slice(1).join(" ") || auditLogEntry?.reason,
      case: parseInt(
        message1.content.match(/Case \d+/g)?.[0].match(/\d+/g)?.[0] as string
      ),
      action: message1.content
        .match(/(ban|kick|unban)(n{1,2})?ed/g)?.[0]
        .replace(/\b\w/g, (v) => v.toUpperCase())
        .replaceAll("ed", "").replace(/n{2,4}$/g, "n") as string,
      emoji: message1.content.match(/(👢|🔨|🔧)/g)?.[0] as string,
    });
    message1.edit(result);
    message.channel.send("👌");
  }
};

export const meta: CommandMetadata = {
  name: "reason",
  description: "Edits a reason in the mod log.",
  accessLevel: 1,
  aliases: [],
};
