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
import {inspect} from "util";
import {CommandExecute, CommandMetadata} from "../types";
import {GitHubRepo, useGitHubApiRouter} from "../util/ghapi";

export const meta: CommandMetadata = {
  name: "github",
  description: "Gets information from the GitHub API about things. Argument 'name' is optional, will default to your username.",
  accessLevel: 0,
  aliases: ["gh"],
  params: [{
    name: "type",
    type: "string",
    options: [
      "user",
      "repository",
      "org"
    ]
  }, {
    name: "name",
    type: "string",
    rest: true,
    optional: true
  }]
}

export const execute: CommandExecute<"name" | "type"> = async ctx => {
  switch (ctx.args.data.type) {
    case "repository": {
      const [router] = useGitHubApiRouter<GitHubRepo>();
      const res = await router.repos(ctx.args.data.name).end().make();
      res.data = JSON.parse(res.raw.toString())
      console.log(res)
      const {data} = res;
      if (!res.ok && res.statusCode === 404) return ctx.message.channel.send("not found").then(() => false);
      else if (!res.ok) return ctx.message.channel.send(`Error ${res.statusCode} ${res.status.text}`).then(() => false)
      const embed = new MessageEmbed()
        .setAuthor(`Repository Information for ${data.full_name}`, null, data.html_url)
	.setThumbnail(data.owner.avatar_url)
	.setColor(ctx.message.guild.me!.roles.highest.color)
	.setDescription(`**Name**: ${data.owner.login}/__${data.name}__
			**Link**: [Click me!](${data.html_url})
			**Description**: ${data.description}
			**Main branch**: \`${data.default_branch}\`
			**Owner**: [${data.owner.login}](${data.owner.html_url})${data.language ? "\n**Most used language**: " + data.language : ""}
			**Stargazers**: \`${data.stargazers_count}\`
			**Watchers**: \`${data.watchers_count}\``.replace(/\n[\t\n ]*/g, '\n'))
      ctx.message.channel.send(embed)
    }
  }
  return true
}
