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
import CatLoggr from 'cat-loggr/ts';
import { Client, WSEventType, User, TextChannel, Snowflake } from 'discord.js';
import { config } from 'dotenv';
import { join } from 'path';
import { INTENTS } from './constants';
import { Command, SlashCommand } from './types';
import { loadFiles } from './util';
import { guilds as guildConfig } from './modules/config.json';
export const loggr = new CatLoggr();
export const commands = loadFiles<Command>('../commands');
export const slashCommands = loadFiles<SlashCommand>('../commands/slash');
export const startedTimestamp = Date.now();
export const startedAt = new Date();
import 'reflect-metadata';
import { createConnection } from 'typeorm';
export let connectionName = 'default';
import { User as U } from './entity/User';
createConnection({
  type: 'postgres',
  database: 'splat',
  username: 'splat',
  password: 'mabuis1',
  port: 5432,
  entities: [U],
  logging: true,
})
  .then(c => {
    console.log('Connected to database', c.name);
    connectionName = c.name;
  })
  .catch(console.error);
const moduleConfig: {
  [k in Snowflake]: {
    enabledModules: string[];
    staffRole?: Snowflake;
  };
} = guildConfig;
const client = new Client({
  allowedMentions: { users: [], roles: [], parse: [], repliedUser: false },
  presence: {
    status: 'idle',
    activity: {
      name: 'moderation events',
      type: 'WATCHING',
    },
  },
  intents: INTENTS,
  partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'],
});
config({
  path: join(__dirname, '..', '.env'),
});
loggr.debug('Loading events...');
// normal events
for (const [event, { execute }] of loadFiles<EventType>('../events')) {
  client.on(event, (...params) => execute(client, ...params));
  loggr.debug(`Loaded event ${event}`);
}
type EventType = { execute: (client: Client, ...args: any[]) => boolean };
// websocket events
for (const [event, { execute }] of loadFiles<EventType>('../events/ws')) {
  client.ws.on(event as WSEventType, (...params) => execute(client, ...params));
  loggr.debug(`Loaded WebSocket event ${event}`);
}

type LightbulbModule = {
  ws?: boolean;
  eventName: string;
  execute: (client: Client, ...params: any[]) => boolean | Promise<boolean>;
  name: string;
  emitter: 'on' | 'once';
  guildablePath: string;
  restricted: boolean;
};

for (const [filename, modules] of loadFiles<Record<string, LightbulbModule>>(
  '../modules'
)) {
  for (const [name, value] of Object.entries(modules)) {
    console.log(name, value);
    client[value.emitter](value.eventName, (...params) => {
      // @ts-ignore
      if (
        value.restricted &&
        !(
          eval(value.guildablePath) in guildConfig ||
          moduleConfig[
            eval(value.guildablePath) as string
          ]?.enabledModules.includes(`${filename}.${name}`) ||
          (moduleConfig[eval(value.guildablePath) as string] as Record<
            'enabledModules',
            string[]
          >)?.enabledModules.includes(`${filename}.*`)
        )
      )
        return;
      value.execute(client, ...params);
    });
    console.log(`Loaded module ${name}`);
  }
}

// emit reactions for uncached messages
client.on('raw', packet => {
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
    return;
  // Grab the channel to check the message from
  const channel = client.channels.cache.get(packet.d.channel_id) as TextChannel;
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel!.messages.cache.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel!.messages.fetch(packet.d.message_id).then(message => {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id
      ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
      : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.resolve(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction)
      reaction.users.cache.set(
        packet.d.user_id,
        client.users.cache.get(packet.d.user_id) as User
      );
    // Check which type of event it is before emitting
    if (packet.t === 'MESSAGE_REACTION_ADD') {
      client.emit(
        'messageReactionAdd',
        reaction,
        client.users.cache.get(packet.d.user_id) as User
      );
    } else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      client.emit(
        'messageReactionRemove',
        reaction,
        client.users.cache.get(packet.d.user_id) as User
      );
    }
  });
});

client.login(process.env.TOKEN);
