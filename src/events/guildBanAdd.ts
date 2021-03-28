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
import {
  Client,
  Guild,
  GuildMember,
  Permissions,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js';
import { createLogMessage, getCases, getLogChannel } from '../util';

export const execute = async (client: Client, guild: Guild, user: User) => {
  if (!guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
  let channel = getLogChannel(guild) as TextChannel,
    auditLogs = await guild.fetchAuditLogs({
      type: 'MEMBER_BAN_ADD',
      limit: 1,
    }),
    auditLogEntry = auditLogs.entries.find(
      value =>
        value.action == 'MEMBER_BAN_ADD' &&
        (value.target as { id: Snowflake })?.id === user.id
    );
  while (!auditLogEntry) {
    auditLogs = await guild.fetchAuditLogs({
      type: 'MEMBER_BAN_ADD',
      limit: 1,
    });
    auditLogEntry = auditLogs.entries.find(
      value =>
        value.action == 'MEMBER_BAN_ADD' &&
        (value.target as { id: Snowflake })?.id === user.id
    );
    if (auditLogEntry) break;
  }
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
      action: 'Ban',
      emoji: '🔨',
    });
    channel.send(result);
  }
};
