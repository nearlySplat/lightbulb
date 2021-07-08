/* eslint-disable no-undef */
let seq = 0;
process.on('message', message => {
  if (message.seq) seq = message.seq;
});
setInterval(() => {
  process.send({
    op: 2,
    seq,
    m: 'PING',
  });
}, 1000);
setTimeout(() => process.send({ op: 3 }), 10000);
console.log('[PROCESS_CHILD] Logged messages.');
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
import CatLoggr from 'cat-loggr/ts';
import {
  Client,
  ClientEvents,
  MessageReaction,
  ReactionEmoji,
  ReactionUserManager,
  TextChannel,
  User,
  WSEventType
} from 'discord.js';
import { config } from 'dotenv';
import { get } from 'lodash';
import { connect } from 'mongoose';
import { join } from 'path';
import * as Statcord from 'statcord.js';
import { INTENTS } from './constants';
import { guilds as guildConfig } from './modules/config.json';
import './site';
import { Command, SlashCommand } from './types';
import { loadFiles } from './util';
export const env = config({
  path: join(__dirname, '..', '.env'),
});
export let mongoose: typeof import('mongoose') = connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) as unknown as typeof import('mongoose');
export const loggr = new CatLoggr({});
export const commands = loadFiles<Command>('../commands');
export const slashCommands = loadFiles<SlashCommand>('../commands/slash');
export const startedTimestamp = Date.now();
export const startedAt = new Date();
(async () => {
  mongoose = await Promise.resolve(
    <Promise<typeof import('mongoose')>>(<unknown>mongoose)
  );
  loggr.info('[MONGODB] connected to mongodb server');
})();
const moduleConfig: {
  [k: string]: {
    enabledModules: string[];
    staffRole?: string;
  };
} = guildConfig;
export const client = new Client({
  allowedMentions: { users: [], roles: [], parse: [], repliedUser: false },
  presence: {
    status: 'idle',
    activities: [
      {
        name: 'moderation events',
        type: 'WATCHING',
      },
    ],
  },
  intents: INTENTS,
  partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'],
});

export const statcord = new Statcord.Client({
  client,
  key: process.env.STATCORD,
  postCpuStatistics:
    true /* Whether to post memory statistics or not, defaults to true */,
  postMemStatistics:
    true /* Whether to post memory statistics or not, defaults to true */,
  postNetworkStatistics:
    true /* Whether to post memory statistics or not, defaults to true */,
});

statcord
  .on('post', status => {
    // status = false if the post was successful
    // status = "Error message" or status = Error if there was an error
    if (!status) loggr.info('[Statcord] Successful post');
    else loggr.error('[Statcord]', status);
  })
  .on('autopost-start', () => {
    loggr.info('[Statcord] Started autopost');
  });

loggr.debug('Loading events...');
// normal events
for (const [event, { execute }] of loadFiles<EventType>('../events')) {
  client.on(
    event as keyof ClientEvents,
    (...params) => execute(client, ...params) as unknown as void
  );
  loggr.debug(`Loaded event ${event}`);
}
type EventType = { execute: (client: Client, ...args: unknown[]) => boolean };
// websocket events
for (const [event, { execute }] of loadFiles<EventType>('../events/ws')) {
  client.ws.on(event as WSEventType, (...params) => execute(client, ...params));
  loggr.debug(`Loaded WebSocket event ${event}`);
}

export type LightbulbModule = {
  ws?: boolean;
  eventName: string;
  execute: (client: Client, ...params: unknown[]) => boolean | Promise<boolean>;
  name: string;
  emitter: 'on' | 'once';
  guildablePath: string;
  restricted: boolean;
};

for (const [filename, modules] of loadFiles<Record<string, LightbulbModule>>(
  '../modules'
)) {
  for (const [name, value] of Object.entries(modules)) {
    client[value.emitter](value.eventName, (...params) => {
      const id = get(
        params[0],
        value.guildablePath
          .replace(/^params\[0]\??\./, '')
          .replace(/\?\./g, '.')
      ) as string;
      if (
        value.restricted &&
        (!(id in moduleConfig) ||
          !(
            moduleConfig[id]?.enabledModules.includes(`${filename}.${name}`) ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            moduleConfig[id]?.enabledModules.includes(`${filename}.*`)
          ))
      )
        return;
      value.execute(client, ...params);
    });
  }
}

// emit reactions for uncached messages
client.on('raw', packet => {
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
    return;

  // Grab the channel to check the message from
  const channel = client.channels.cache.get(packet.d.channel_id) as TextChannel;
  // Since we have confirmed the message is not cached, let's fetch it
  channel!.messages
    .fetch(packet.d.message_id, {
      cache: true,
      force: true,
    })
    .then(message => {
      // Emojis can have identifiers of name:id format, so we have to account for that case as well
      const emoji = packet.d.emoji.id
        ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
        : packet.d.emoji.name;
      // This gives us the reaction we need to emit the event properly, in top of the message object
      let reaction =
        packet.t === 'MESSAGE_REACTION_REMOVE' &&
        message.reactions.resolve(emoji);
      // Adds the currently reacting user to the reaction's users collection.
      if (reaction)
        reaction.users.cache.set(
          packet.d.user_id,
          client.users.cache.get(packet.d.user_id) as User
        );
      else {
        reaction = {
          count: 0,
          message,
          client,
          get emoji() {
            return new ReactionEmoji(
              this as unknown as MessageReaction,
              packet.d.emoji
            );
          },
          _emoji: packet.d.emoji,
          partial: false,
          me: false,
          toJSON() {
            return { ...this };
          },
          async remove(): Promise<null> {
            return null;
          },
          get users() {
            const h = {
              // eslint-disable-next-line @typescript-eslint/ban-types
              get(): {} {
                return new Proxy({}, h);
              },
            };
            return new Proxy({}, h) as ReactionUserManager;
          },
          async fetch() {
            return this;
          },
        } as unknown as MessageReaction;
      }

      // Check which type of event it is before emitting
      if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit(
          'messageReactionAdd',
          reaction,
          client.users.cache.get(packet.d.user_id) as User
        );
        client.emit(
          'actualMessageReactionAdd',
          reaction,
          client.users.cache.get(packet.d.user_id) as User
        );
      } else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        client.emit(
          'messageReactionRemove',
          reaction,
          client.users.cache.get(packet.d.user_id) as User
        );
        client.emit(
          'actualMessageReactionRemove',
          reaction,
          client.users.cache.get(packet.d.user_id) as User
        );
      }
    });
});

client.login(process.env.TOKEN);
