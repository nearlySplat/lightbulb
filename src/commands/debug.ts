import { Intents, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { startedTimestamp } from '..';
import { CLIENT_COLOUR, INTENTS } from '../constants';
import { CommandMetadata, Context } from '../types';
export const execute = async ({
  message,
  commands,
  client,
  commandHandlerStarted,
}: Context): Promise<boolean> => {
  const events = readdirSync(join(__dirname, '..', 'events'));
  const _ = new MessageEmbed()
    .setAuthor('Debug Information')
    .setDescription(
      `
      - I am currently on shard \`${message.guild?.shardID}\` with \`${
        commands.size
      }\` commands.
        - I have requested gateway intents of \`${INTENTS}\` (${new Intents(
        INTENTS
      )
        .toArray()
        .map(v => `\`${v}\``)}).
        - I am ${
          !(await client.fetchApplication()).botPublic ? '**not** ' : ''
        }available to invite to guilds.
        - Available events are ${events
          .map(
            v =>
              `\`${v
                .replace(/\.[jt]s/g, '')
                .replace(/([a-z])([A-Z])/g, '$1_$2')
                .toUpperCase()}\``
          )
          .join(', ')}.
          - It took a total of \`${
            (client.readyTimestamp as number) - startedTimestamp
          }ms\` for me to boot.
          - Command handler latency is \`${
            Date.now() - commandHandlerStarted
          }ms\`.
  `.replace(/\n +/g, '\n')
    )
    .setColor(CLIENT_COLOUR)
    .setThumbnail(client.user?.avatarURL() as string)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    );
  message.channel.send(_);
  return true;
};

export const meta: CommandMetadata = {
  name: 'debug',
  description: 'Get debug information about the bot',
  accessLevel: 0,
  aliases: ['ping'],
};
