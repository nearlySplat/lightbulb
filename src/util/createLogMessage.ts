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
  let result = `
    \`[Case ${options.case}]\` ${options.emoji} **${options.perpetrator.tag}** (${options.perpetrator.id}) \`${
    options.action.toLowerCase()
  }${options.action.endsWith("n") ? "n" : ""}ed]\` ${(options.context ? options.context + " " : undefined) ?? ""}**${options.victim.tag}** (${options.victim.id})
    \`[Reason]\` ${options.reason ?? 'None'}
      `
    .replace(/(\n +)/g, '\n')
    .replace(/^\n/g, '');
  return result;
};
