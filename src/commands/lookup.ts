import { Context } from "../types";
import { SnowflakeUtil } from "discord.js";

export const execute = (ctx: Context): Promise<boolean> => {
  ctx.message.channel.send(Object.keys(SnowflakeUtil.deconstruct(ctx.args[0] ?? ctx.message.author.id)).map(([K, V]) => `**${K}**: \`${V instanceof Date ? V.toLocaleString() : V}\``))
  return true;
}

export const meta: CommandMetadata = {
  name: "lookup",
  description: "Looks up an ID in Discord.",
  accessLevel: 1,
  aliases: [],
};
