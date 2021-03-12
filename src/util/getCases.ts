import { Guild } from 'discord.js';

export const getCases = async (guild: Guild) => {
  const entries = [
    (await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })).entries.size,
    (await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' })).entries.size,
  ];
  return entries.reduce((a, b) => a + b);
};
