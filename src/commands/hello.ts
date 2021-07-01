import { CommandExecute, CommandMetadata } from '../types';
import { sleep } from '../util/sleep';
export const meta: CommandMetadata = {
  name: 'hello',
  description: 'hi',
  accessLevel: 0,
  aliases: [],
};
export const execute: CommandExecute = async ctx => {
  await ctx.message.channel.startTyping();
  await sleep(7000 * 60 * 60);
  ctx.message.channel.stopTyping();
  await sleep(1000 * 60 * 60 * 3);
  await ctx.message.channel.startTyping();
  await sleep(1000 * 60 * 60 * 10);
  ctx.message.channel.stopTyping();
  return [{ content: 'hi', components: [] }, null];
};
