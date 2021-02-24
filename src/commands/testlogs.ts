import { Context, CommandMetadata } from '../types';
import { GuildMember, TextChannel } from "discord.js";
import { getCases, createLogMessage } from "../util";
export const execute = ({ message }: Context): boolean | Promise<boolean> => {
  const channel = message.guild.channels.cache.find(
      value =>
        ((value.name?.match(/^💡(-log(s|ging)?)?$/g) || value.topic?.includes("--lightbulb-logs")) &&
          value.type == 'text' &&
          value
            .permissionsFor(message.guild.me as GuildMember)
            ?.has('SEND_MESSAGES')) ??
        false
    ) as TextChannel;
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes('--compact'),
      victim: {
        tag: "1",
        id: "Clyde#0000",
      },
      perpetrator: {
        id: "0".repeat(17),
        tag: "Nelly#0000",
      },
      reason: `Mod Log test by **${message.author.tag}**`,
      case: await getCases(message.guild),
      action: 'Ban',
      emoji: "🔨"
    });
    channel.send(result);
  }
  return true;
};

export const meta: CommandMetadata = {
  name: 'testlogs',
  description: 'Test the modlog',
  accessLevel: 2,
  aliases: [],
  hidden: true,
};
