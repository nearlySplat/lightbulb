import { YAMLConfig } from '@lightbulb/src/types';
import CatLoggr from 'cat-loggr/ts';
import { ClientOptions as DJSClientOptions } from 'discord.js';

export interface ClientOptions extends DJSClientOptions {
  config: YAMLConfig;
  loggr: CatLoggr;
}
