import {
  Client,
  GuildMember,
  Permissions,
  Snowflake,
  TextChannel,
} from 'discord.js';
import { createLogMessage, getCases, getLogChannel, sleep } from '../util';

export const execute = async (client: Client, { guild, user }: GuildMember) => {
  await sleep(5000);
  if (!guild.me!.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
  let channel = getLogChannel(guild) as TextChannel,
    auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_KICK' }),
    auditLogEntry = auditLogs.entries.find(
    value =>
      value.action == 'MEMBER_KICK' &&
      (value.target as { id: Snowflake })?.id === user.id
  );
  if (!auditLogEntry) return;
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes('--compact'),
      victim: {
        tag: user.tag,
        id: user.id,
      },
      perpetrator: {
        id: auditLogEntry?.executor.id,
        tag: auditLogEntry?.executor.tag,
      },
      reason: auditLogEntry?.reason,
      case: await getCases(guild),
      action: 'Kick',
      emoji: '👢',
    });
    channel.send(result);
  }
};
