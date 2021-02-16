import { Context, CommandMetadata } from "../types";
import { SnowflakeUtil, MessageEmbed } from "discord.js";
import { CLIENT_COLOUR } from "../constants";

export const execute = async (ctx: Context): Promise<boolean> => {
  const deconstructed = SnowflakeUtil.deconstruct(
    ctx.args[0] ?? ctx.message.author.id
  ), user = await ctx.client.users.fetch(ctx.args[0]).catch(e => null), invite = ctx.client.fetchInvite(ctx.args[0]).catch(e => null)
  const _ = new MessageEmbed()
    .addField(
      "Snowflake",
      Object.entries(deconstructed).map(
        ([K, V]) =>
          `**${K.replace(/\b\w/g, (v) => v.toUpperCase()).replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
          )}**: \`${
            (V as Date | string | number) instanceof Date
              ? V.toLocaleString()
              : V
          }\``
      )
    )
    .setColor(CLIENT_COLOUR)
    .setAuthor(`Lookup Information for ${ctx.args[0]}`)
    .setFooter(
      `Requested by ${ctx.message.author.tag} (${ctx.message.author.id}) | Snowflake created at`
    )
    .setTimestamp(deconstructed.timestamp)
    .setThumbnail(ctx.client.user?.avatarURL() as string);
  if (user) {
    _.setAuthor(`Lookup for ${user.tag}`)
      .addField("User Info", `**Tag**: ${user.tag}\n**ID***: ${user.id}`)
      .setThumbnail(user.avatarURL() as string);
  }
  ctx.message.reply({ allowedMentions: { repliedUser: false, parse: [] }, embed: _ })
  return true;
};

export const meta: CommandMetadata = {
  name: "lookup",
  description: "Looks up an ID in Discord.",
  accessLevel: 0,
  aliases: [],
};
