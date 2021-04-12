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
import { Client, MessageReaction, User } from 'discord.js';

export const selfStarShaming = {
  emitter: 'on',
  eventName: 'messageReactionAdd',
  guildablePath: 'params[0].message.guild.id',
  restricted: true,
  execute: async (
    _client: Client,
    reaction: MessageReaction,
    user: User
  ): Promise<boolean> => {
    if (
      reaction.message.author?.id === user?.id &&
      reaction.emoji.name === '⭐'
    )
      reaction.message.channel.send(
        `Self-star detected by ${user} (**${user.username}**#${user.discriminator}) on message \`${reaction.message.id}\``
      );
    return true;
  },
};
