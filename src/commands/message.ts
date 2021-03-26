import {Message, MessageFlags, NewsChannel, TextChannel, Util} from "discord.js";
import {CommandExecute, CommandMetadata} from "../types";
import {i18n} from "../util";

export const meta: CommandMetadata = {
  name: "message",
  description: "Gets info about a specific message in a channel.",
  params: [{
    name: "messageid",
    type: "string",
    optional: true
  }, {
    name: "channelid",
    type: "string",
    optional: true
  }],
  aliases: ["messageinfo", "mi"],
  accessLevel: "USER"
}

const keywords = {
  "first": async (_, c: TextChannel) => await c.messages.fetch({
    limit: 1,
    after: "1",
  }).then(v => v.first()),
  "latest": async (_, c: TextChannel) => await c.messages.fetch({
    limit: 1
  }).then(v => v.first()),
  "this": (m: Message) => m
}, handleKeyword = (word: keyof typeof keywords, m: Message, c: TextChannel) => keywords[word](m, c)

export const execute: CommandExecute<"messageid" | "channelid"> = async ({ message, args, locale }) => {
  let channel = message.guild.channels.cache.get(args.data.channelid?.replace(/(^<#|>$)/g, "") || message.channel.id) as TextChannel;
  if (!channel || !([NewsChannel, TextChannel].some(v => channel instanceof v))) {
    message.channel.send(i18n.get("MESSAGEINFO_CHANNEL_NOT_FOUND", locale));
    return false;
  }
  let target: Message;
  try {
    target = await (args.data.messageid in keywords ? handleKeyword(args.data.messageid as keyof typeof keywords, message, channel) : channel.messages.fetch(args.data.messageid || message.id)) as Message;
  } catch {
    message.channel.send(i18n.get("MESSAGEINFO_MESSAGE_NOT_FOUND", locale));
    return false;
  }
  const text = `\`\`\`prolog
               ID: ${target.id}
            Flags: ${target.flags.toArray().join(", ") || "None"}
           Author: ${target.author.tag} (${target.author.id})
          Channel: #${(target.channel as TextChannel).name} (${target.channel.id})
          Content: ${target.content !== "" ? `
	           > ${Util.escapeMarkdown(target.content, {
      codeBlock: true,
      inlineCode: true,
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      spoiler: false
    }).replace(/\n/g, "\n             > ")}` : "None"}
           Pinned: ${target.pinned}
Embeds Suppressed: ${target.flags.has(MessageFlags.FLAGS.SUPPRESS_EMBEDS)}
           Embeds: ${target.embeds.length}
       Created At: ${target.createdAt.toLocaleString()} (UNIX time: ${target.createdTimestamp})
\`\`\`
[Jump!](${target.url})`;
  message.channel.send({ embed: {
    author: {
      name: `${target.author.tag} (${target.author.id})`,
      iconURL: target.author.avatarURL() || target.author.defaultAvatarURL,
      url: message.url
    },
    color: "YELLOW",
    description: text,
    footer: {
      text: i18n.interpolate(i18n.get("GENERIC_REQUESTED_BY", locale), { requester: `${message.author.tag} (${message.author.id})` }),
      iconURL: message.author.avatarURL() as string,
    },
    timestamp: Date.now()
  } })
  return true
}
