import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';

export const execute: CommandExecute = ({ message, args }) => {
  message.reply(`https://discord.com/oauth2/authorize?client_id=${args?.[0] ?? message.client.user?.id}&scope=bot`, {
    allowedMentions: {
      repliedUser: false,
      parse: [],
    },
  });
  return true;
};

export const meta: CommandMetadata = {
  name: 'invite',
  description: 'Gets an invite link for me or any bot.',
  accessLevel: 0,
  aliases: [],
};
