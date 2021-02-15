import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { Permissions } from "discord.js";

export const execute: CommandExecute = ({ message, args }) => {
  message.reply(`<https://discord.com/oauth2/authorize?client_id=${args?.[0] ?? message.client.user?.id}&scope=bot${args[1] ? `&permissions=${args.slice(1).map(v => Permissions.FLAGS[v.toUpperCase() as keyof PermissionFlags] ?? 0).reduce((prev, curr) => prev + curr)}` : ""}>`, {
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
