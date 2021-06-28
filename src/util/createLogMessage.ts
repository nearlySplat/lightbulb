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
import { Snowflake } from 'discord.js';

interface LogMessageOptions {
  compact?: boolean;
  action: string;
  victim: Usr;
  perpetrator: Usr;
  reason?: string | null;
  case: number;
  emoji: string;
  context?: string;
}
type Usr = {
  tag: string;
  id: Snowflake;
};
export const createLogMessage = (options: LogMessageOptions): string => {
  const result = `
    \`[Case ${options.case}]\` ${options.emoji} **${
    options.perpetrator.tag
  }** (${options.perpetrator.id}) \`[${options.action?.toLowerCase()}${
    options.action.endsWith('n') ? 'n' : ''
  }ed]\` ${(options.context ? options.context + ' ' : undefined) ?? ''}**${
    options.victim.tag
  }** (${options.victim.id})
    \`[Reason]\` ${options.reason ?? 'None'}
      `
    .replace(/(\n +)/g, '\n')
    .replace(/^\n/g, '');
  return result;
};
