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
import { config, __prod__ } from '../../src/constants.js';
import { i18n } from '../../src/util';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import CatLoggr from 'cat-loggr/ts';
import { Client } from 'discord.js';
import moment, { Moment } from 'moment';
import { ClientOptions } from '../interfaces/ClientOptions';
import { Manager } from './Manager';

export class Candle extends Client {
  liftoff: Moment;
  manager: Manager;

  // logging
  loggr: CatLoggr;
  sentry: typeof import('@sentry/node');
  transaction: import('@sentry/types/dist/transaction').Transaction;

  // i18n
  i18n = i18n;

  constructor(token: string, options: ClientOptions) {
    super(options);
    this.token = token;
    this.sentry = options.sentry;
    this.manager = new Manager();
    this.loggr = options.loggr;

    this.sentry.init({
      dsn: config.sentry_dsn,
      environment: __prod__ ? 'production' : 'development',
      release: this.manager.commit,
      integrations: [
        new Tracing.Integrations.Mongo({ useMongoose: true }),
        new Sentry.Integrations.OnUncaughtException({}),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        new RewriteFrames({
          root: (<NodeJS.Global>global).__rootdir__,
        }),
      ],
      tracesSampleRate: 1.0,
    });

    this.transaction = this.sentry.startTransaction({
      op: `transaction-${Date.now()}`,
      name: 'Automatic transaction on client ready',
    });
  }

  // meme helper functions
  light(): Promise<string> {
    return this.login(this.token);
  }
  extinguish(): void {
    return this.destroy();
  }

  /**
   * @private
   */
  async login(token: string): Promise<string> {
    await super.login(token);
    this.liftoff = moment(moment.now());
    return this.token;
  }
}
