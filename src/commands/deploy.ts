import { CommandExecute, CommandMetadata } from "../types";
import { sleep } from "../util/";
import { WHITELIST } from '../constants';
export const meta: CommandMetadata = {
  name: "deploy",
  description: "Deploys obama.",
  aliases: ["obama"],
  accessLevel: 0,
}

export const execute: CommandExecute = async ctx => {
  async function confirm(): Promise< true | void> {
    const msg = await ctx.message.channel.send({content:`<@332864061496623104>, ${ctx.message.author.username} wants to deploy Obama. Authorize?`,allowedMentions:{users:['332864061496623104']}})
  }
  const authorizedUsers = [...WHITELIST, '332864061496623104'];
  if (!authorizedUsers.includes(ctx.message.author.id)) return [{content:"You are not authorized to execute this action!"},null];
  if ('332864061496623104' === ctx.message.author.id) deploy();
  else confirm().then(v => v ? deploy() : false);
}
