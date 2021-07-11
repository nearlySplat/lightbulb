import { Client as DJSClient } from 'discord.js';
import { Manager } from './Manager';
import moment, { Moment } from 'moment';
import { ClientOptions } from '../interfaces/ClientOptions';

export class Candle extends DJSClient {
  liftoff: Moment;
  manager: Manager;

  constructor(token: string, options: ClientOptions) {
    super(options);
    this.token = token;
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
   * @internal
   */
  async login(token: string): Promise<string> {
    await super.login(token);
    this.liftoff = moment(moment.now());
    return this.token;
  }
}
