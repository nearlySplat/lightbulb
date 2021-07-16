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
import { buttonHandlers } from '@lightbulb/src/events/messageCreate.js';
import {
  ButtonInteractionHandler,
  Context,
  ExtendedMessageOptions,
} from '@lightbulb/src/types.js';
import { CommandParameters } from '@lightbulb/src/util/Parameters.js';
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
      content: this.context.t('generic.not_implemented', {
        thing: 'This command',
      }),
    });
  }
}
