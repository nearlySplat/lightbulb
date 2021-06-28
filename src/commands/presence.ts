import { User } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types.js';
import { AccessLevels } from '../util/getAccessLevel.js';
import { getMember } from '../util';
import { statusEmojis } from './user.js';

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

export const execute: CommandExecute = ctx => {
  let target: User;
  if (!ctx.args.data.user) {
    target = ctx.message.author;
  } else {
    target = getMember(ctx.message.guild, ctx.args.data.user).user;
  }
  if (!target) return [{ content: 'No user found.' }, null];
  if (!target.presence.clientStatus) return [{ content: 'No data.' }, null];
  const status = target.presence.clientStatus;
  return [
    {
      content: `**__${target.tag}'s Presence__**\n\n${
        status.desktop ? `**Desktop**: <${statusEmojis[status.desktop]}>\n` : ''
      }${status.web ? `**Web**: <${statusEmojis[status.web]}>\n` : ''}${
        status.mobile
          ? `**Mobile** <${statusEmojis.mobile}>: <${
              statusEmojis[status.desktop]
            }>\n`
          : ''
      }`,
    },
  ];
};
