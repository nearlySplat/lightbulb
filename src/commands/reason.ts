import {
  Client,
  Guild,
  GuildMember,
  Permissions,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js';
import { createLogMessage, getCases } from '../util';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata, Context } from '../types';

export const execute = async ({ message: { guild, ...message }, args }: Context): any => {
  if (!guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
  const channel = guild.channels.cache.find(
      value =>
        (value.name?.match(/^💡(-log(s|ging)?)?$/g) &&
          value.type == 'text' &&
          value
            .permissionsFor(guild.me as GuildMember)
            ?.has('SEND_MESSAGES')) ??
        false
    ) as TextChannel,
    auditLogs = await guild.fetchAuditLogs();
  const message = channel?.messages.cache.find(v => v.content.startsWith(`\`[Case ${args[0]}]\``));
  if (!message1) return message.react("😔");
  const matchedUser = message1.content.match(/ed]` [^#]+#\d{4} \((\d+)\)/g)?.[0].match(/\d{5}\d+/g)?.[0];
  const user = await message.client.users.fetch(`${matchedUser}`).catch(() => null)
  if (!user) return message.react("😔");
  const auditLogEntry = auditLogs.entries.find(
      value =>
        value.action == 'MEMBER_BAN_ADD' &&
        (value.target as { id: Snowflake })?.id === user.id
    );
  if (!auditLogEntry) return false;
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes('--compact'),
      victim: {
        tag: user.tag,
        id: user.id,
      },
      perpetrator: {
        id: message.author.id,
        tag: message.author.tag,
      },
      reason: args.slice(1).join(" ") || auditLogEntry?.reason,
      case: parseInt(message1.content.match(/Case \d+/g)?.[0].match(/\d+/g)?.[0]),
      action: 'Ban',
      emoji: "🔨"
    });
    message1.edit(result);
    message.channel.send("👌")
  }
};

export const meta: CommandMetadata = {
  name: 'reason',
  description: 'Edits a reason in the mod log.',
  accessLevel: 1,
  aliases: [],
};
