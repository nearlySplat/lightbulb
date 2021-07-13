/* eslint-disable no-undef */
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
import * as Sentry from '@sentry/node';
import CatLoggr from 'cat-loggr/ts';
import { ClientEvents, WSEventType } from 'discord.js';
import { config } from 'dotenv';
import { get } from 'lodash';
import { connect } from 'mongoose';
import { join } from 'path';
import * as Statcord from 'statcord.js';
import { Candle } from '../lib/structures/Client.js';
import { config as yamlConfig, INTENTS } from './constants';
import { guilds as guildConfig } from './modules/config.json';
import { Command, SlashCommand } from './types';
import { loadFiles } from './util';

export const env = config({
  path: join(__dirname, '..', '..', '.env'),
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

export const candle = new Candle(process.env.TOKEN, {
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
  config: yamlConfig,
  loggr,
  sentry: Sentry,
});

export const statcord = new Statcord.Client({
  client: candle,
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
  candle.on(event as keyof ClientEvents, execute.bind(null, candle));
  loggr.debug(`Loaded event ${event}`);
}
type EventType = {
  execute: (client: Candle, ...args: unknown[]) => void;
};
// websocket events
for (const [event, { execute }] of loadFiles<EventType>('../events/ws')) {
  candle.ws.on(event as WSEventType, execute.bind(null, candle));
  loggr.debug(`Loaded WebSocket event ${event}`);
}

export type LightbulbModule = {
  ws?: boolean;
  eventName: string;
  execute: (client: Candle, ...params: unknown[]) => boolean | Promise<boolean>;
  name: string;
  emitter: 'on' | 'once';
  guildablePath: string;
  restricted: boolean;
};

for (const [filename, modules] of loadFiles<Record<string, LightbulbModule>>(
  '../modules'
)) {
  for (const [name, value] of Object.entries(modules)) {
    candle[value.emitter](value.eventName, (...params) => {
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
      value.execute(candle, ...params);
    });
  }
}

candle.light();

// This allows TypeScript to detect our global value
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __rootdir__?: string;
    }
  }
}

(global as NodeJS.Global).__rootdir__ = __dirname || process.cwd();

const exitHandler = () => {
  candle.transaction.finish();
  candle.loggr.info('Process exiting...');
};
