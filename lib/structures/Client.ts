import { Client as DJSClient } from 'discord.js';
import { Manager } from './Manager';
import moment, { Moment } from 'moment';
import { ClientOptions } from '../interfaces/ClientOptions';
import { i18n } from '../../src/util/index.js';
import { config, __prod__ } from '../../src/constants.js';
import * as Tracing from '@sentry/tracing';

export class Candle extends DJSClient {
  liftoff: Moment;
  manager: Manager;
  sentry: typeof import('@sentry/node');

  i18n = i18n;

  constructor(token: string, options: ClientOptions) {
    super(options);
    this.token = token;
    this.sentry = options.sentry;
    this.manager = new Manager();

    this.sentry.init({
      dsn: config.sentry_dsn,
      environment: __prod__ ? 'production' : 'development',
      release: this.manager.commit,
      integrations: [new Tracing.Integrations.Mongo({ useMongoose: true })],
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
