import { Message as DJSMessage, MessageOptions } from 'discord.js';
import { ExtendedMessageOptions } from '../../src/types.js';
import { Candle } from './Client.js';

export class Message extends DJSMessage {
  declare client: Candle;
  async reply(options: ExtendedMessageOptions): Promise<Message> {
    if (options.embeds || options.embed) {
      options.embeds = [options.embed];
    }
    if (options.code) {
      options.content = `\`\`\`${options.code === true ? '' : options.code}\n${
        options.content
      }\n\`\`\``;
    }
    return <Promise<Message>>super.reply(<MessageOptions>options);
  }
}
