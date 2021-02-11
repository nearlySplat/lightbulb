import { Permissions } from 'discord.js';

export const permissionLevels: Record<string, bigint[]> = {
  Member: [Permissions.FLAGS.SEND_MESSAGES],
  Helper: [Permissions.FLAGS.KICK_MEMBERS],
  Moderator: [Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.MANAGE_MESSAGES],
  Manager: [Permissions.FLAGS.MANAGE_GUILD],
  Administrator: [Permissions.FLAGS.ADMINISTRATOR],
};

export const permissionLevelsArray: bigint[][] = Object.values(
  permissionLevels
);
export const permissionLevelsVerbose: string[] = Object.keys(permissionLevels);
