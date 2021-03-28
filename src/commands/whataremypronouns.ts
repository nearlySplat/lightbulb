import {MessageEmbed} from "discord.js";
import {User} from "../entity/User";
import {CommandExecute, CommandMetadata} from "../types";

export const meta: CommandMetadata = {
  name: 'whataremypronouns',
  description: "When you forget your gender",
  aliases: ["pronouns","changemypronounspls"],
  accessLevel: 0
}

export const execute: CommandExecute = async ctx => {
  let data = await User.findOne({
    where: {
      userid: ctx.message.author.id
    }
  }).catch(() => null)
  if (!data) {
    const newData = new User();
    newData.userid = ctx.message.author.id;
    newData.save()
    data = newData
  }
  const embed = new MessageEmbed()
    .setAuthor(`${ctx.message.author.tag}'s Pronouns`, ctx.message.author.displayAvatarURL({
      dynamic: true
    }))
    .setDescription(`Your pronouns are: ${formatPronouns(data.pronouns)}`)
    .setColor(ctx.message.guild.me!.roles.highest.color)
    ctx.message.channel.send(embed);
    return true
}

export function formatPronouns(pronouns: User["pronouns"]) {
  return `${Object.entries(pronouns).filter(([K]) => K !== "singularOrPlural").map(([,V]) => V).join("/")} (${pronouns.singularOrPlural})`
}
