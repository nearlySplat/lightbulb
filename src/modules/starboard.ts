/*
 * Copyright (C) 2020 Splatterxl
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
import {
  APIMessage,
  GuildChannel,
  Message,
  MessageEmbed,
  MessageReaction,
  TextChannel,
  User,
} from 'discord.js';
import { LightbulbModule, loggr } from '..';
import { StarboardEntry } from '../entity/StarboardEntry';

export const reactionStarAdd: LightbulbModule = {
  name: 'reactionStarAdd',
  eventName: 'actualMessageReactionAdd',
  guildablePath: 'params[0].message.guild?.id',
  restricted: true,
  emitter: 'on',
  async execute(client, reaction: MessageReaction, user: User) {
    console.log('recieved');
    if (reaction.emoji.name !== '⭐') return false;
    if (user.bot) return false;
    if (reaction.partial) reaction = await reaction.fetch();
    if (reaction.message.partial)
      reaction.message = await reaction.message.fetch();
    console.log('recieved event');
    const entry = await getEntry(reaction);
    if (!entry.starboardChannel) return;
    entry.stars = reaction.count;
    const channel = (await client.channels.fetch(
      entry.starboardChannel
    )) as TextChannel;
    if (entry.correspondingMessage) {
      const correspondingMessage = await channel.messages.fetch(
        entry.correspondingMessage
      );
      correspondingMessage.edit(
        generateStarboardEntryMessage(
          reaction.message as Message & { channel: GuildChannel },
          entry.stars
        )
      );
    } else {
      const correspondingMessage = (await channel.send(
        generateStarboardEntryMessage(
          reaction.message as Message & { channel: GuildChannel },
          entry.stars
        )
      )) as Message;
      entry.correspondingMessage = correspondingMessage.id;
    }
    entry.save();
    return true;
  },
};

function generateStarboardEntryMessage(
  message: Message & { channel: GuildChannel },
  stars: number
) {
  const text = `⭐ ${stars.toLocaleString()} | ${message.channel.toString()}`;
  const embed = new MessageEmbed();
  if (message.attachments.size) embed.setImage(message.attachments.first().url);
  if (message.content) embed.setDescription(message.content);
  else embed.setDescription('[No content]');
  embed
    .setAuthor(
      message.author.tag,
      message.author.displayAvatarURL({ dynamic: true })
    )
    .addField('Link', `[Beam me up!](${message.url})`)
    .setColor('YELLOW')
    .setTimestamp();
  return APIMessage.transformOptions(text, embed);
}

export const reactionStarRemove: LightbulbModule = {
  name: 'reactionStarRemove',
  emitter: 'on',
  eventName: 'actualMessageReactionRemove',
  restricted: false,
  guildablePath: '',
  async execute(client, reaction: MessageReaction | null, user: User) {
    if (user.bot || reaction?.emoji.name !== '⭐') return false;
    if (reaction?.partial) await reaction.fetch();
    if (reaction?.message.partial) await reaction.message.fetch();
    if (reaction && !reaction?.message.guild) return false;
    const entry = await getEntry(reaction);
    console.log(entry.stars, reaction.count);
    entry.stars = reaction.count;
    const channel = client.channels.cache.get(
      entry.starboardChannel
    ) as TextChannel;
    if (!channel) return false;
    if (reaction?.count) {
      const correspondingMessage = (await (entry.correspondingMessage
        ? channel.messages.fetch(entry.correspondingMessage)
        : channel.send(
            generateStarboardEntryMessage(
              reaction.message as Message & { channel: GuildChannel },
              entry.stars
            )
          ))) as Message;
      if (entry.correspondingMessage)
        correspondingMessage.edit(
          generateStarboardEntryMessage(
            reaction.message as Message & { channel: GuildChannel },
            entry.stars
          )
        );
      entry.correspondingMessage = correspondingMessage.id;
      entry.save();
    } else {
      if (entry.correspondingMessage) {
        const correspondingMessage = await channel.messages.fetch(
          entry.correspondingMessage
        );
        correspondingMessage.delete();
      }
      entry.remove().catch(() => {});
    }
    return true;
  },
};

async function getEntry(reaction: MessageReaction) {
  let entry = await StarboardEntry.findOne(reaction.message.id);
  if (!entry) {
    loggr.debug('Had to create new entry.');
    entry = new StarboardEntry();
    entry.id = reaction.message.id;
    entry.starboardChannel =
      /*reaction.message.guild.channels.cache.find(
        t =>
          (t.name === 'starboard' ||
            (t as GuildChannel & { topic?: string }).topic?.includes(
              '--lightbulb-starboard'
            )) &&
          t.permissionsFor(client.user!.id).has('SEND_MESSAGES') &&
          t.type === 'text'
      )?*/ reaction.message.channel.id;
    entry.originalChannel = reaction.message.channel.id;
  }
  return entry;
}
