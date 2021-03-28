/*
 * Copyright (C) 2020 Splaterxl
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
