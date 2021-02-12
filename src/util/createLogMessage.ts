import { Snowflake } from 'discord.js';

interface LogMessageOptions {
  compact?: boolean;
  action: string;
  victim: Usr;
  perpetrator: Usr;
  reason?: string | null;
  case: number;
}
type Usr = {
  tag: string;
  id: Snowflake;
};
export const createLogMessage = (options: LogMessageOptions): string => {
  let result = `
    \`[Case ${options.case}]\` ${
    options.action
  } \`[on]\` **${options.victim.tag}** (${options.victim.id}) \`[by]\` **${options.perpetrator.tag}** (${options.perpetrator.id})
    \`[Reason]\` ${options.reason ?? 'None'}
      `
    .replace(/(\n +)/g, '\n')
    .replace(/^\n/g, '');
  return result;
};
