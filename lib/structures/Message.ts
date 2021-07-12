import { Message as DJSMessage } from 'discord.js';
import { Candle } from './Client.js';

export class Message extends DJSMessage {
  declare client: Candle;
}
