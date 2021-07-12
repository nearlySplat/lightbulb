import { buttonHandlers } from '../../src/events/messageCreate.js';
import {
  ButtonInteractionHandler,
  Context,
  ExtendedMessageOptions,
} from '../../src/types.js';
import { CommandParameters } from '../../src/util/Parameters.js';
import { CommandData } from '../interfaces/CommandData';
import { Message } from './Message';
export class Command {
  args: CommandParameters<string>;
  message: Message;
  data: CommandData;
  replied = false;
  response: Message;
  context: Context;

  constructor(options: CommandData) {
    this.data = options;
  }

  // command.applyParams(...).call()
  applyParams(
    args: CommandParameters<string>,
    message: Message,
    context: Context
  ): this {
    this.replied = false;
    this.args = args;
    this.message = message;
    this.context = context;
    return this;
  }

  async reply(
    data: ExtendedMessageOptions,
    handler?: ButtonInteractionHandler | null
  ): Promise<void> {
    if (!this.message) throw 'Command reply being called with no message.';
    if (this.replied) return;
    this.response = await this.message.reply(data);
    if (handler) buttonHandlers.set(this.response.id, handler);
  }

  call(): void {
    this.reply({
      content: 'Command not implemented yet.',
    });
  }
}
