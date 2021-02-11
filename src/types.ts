import { Client, Collection, Message } from 'discord.js';

export type Command = {
  execute(context: Context): boolean;
  permLevel: number;
};
export interface Context {
  client: Client;
  args: string[];
  message: Message;
  commands: Collection<string, Command>;
}
