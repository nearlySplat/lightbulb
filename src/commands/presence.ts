import { CommandMetadata } from '../types.js';
import { AccessLevels } from '../util/getAccessLevel.js';

export const meta: CommandMetadata = {
  name: 'presence',
  description: 'Shows the presence of a user',
  aliases: ['status'],
  params: [
    {
      name: 'user',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
  accessLevel: AccessLevels.USER,
};
