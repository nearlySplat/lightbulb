import { GuildMember, Permissions } from 'discord.js';
import { WHITELIST as whitelist } from '../constants';
import { AccessLevels } from '../types';
export const accessLevels = {
  USER: 0,
  MODERATOR: 1,
  ADMINISTRATOR: 2,
  OWNER: 3,
} as const;

export const getAccessLevel = (
  level: keyof AccessLevels | 0 | 1 | 2 | 3
): 0 | 1 | 2 | 3 => {
  if (typeof level === 'string') return accessLevels[level];
  else return Object.values(accessLevels)[level] ?? 0;
};

export const getCurrentLevel = (member: GuildMember): 0 | 1 | 2 | 3 => {
  if (whitelist.includes(member.user.id)) {
    return getAccessLevel('OWNER');
  } else if (
    [Permissions.FLAGS.ADMINISTRATOR].every(perm =>
      member.permissions.has(perm)
    )
  ) {
    return getAccessLevel('ADMINISTRATOR');
  } else if (
    [
      Permissions.FLAGS.BAN_MEMBERS,
      Permissions.FLAGS.KICK_MEMBERS,
    ].every(perm => member.permissions.has(perm))
  )
    return getAccessLevel('MODERATOR');
  else return getAccessLevel('USER');
};
