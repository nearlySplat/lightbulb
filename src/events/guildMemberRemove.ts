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
  const channel = getLogChannel(guild) as TextChannel,
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
