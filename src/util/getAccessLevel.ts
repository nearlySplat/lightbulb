import { AccessLevels } from '../types';
const accessLevels = {
  USER: 0,
  MODERATOR: 1,
  ADMINISTRATOR: 2,
  OWNER: 3,
};

export const getAccessLevel = (level: keyof AccessLevels | number) => {
  if (typeof level === 'string') return accessLevels[level];
  else return Object.values(accessLevels)[level] ?? 0;
};
