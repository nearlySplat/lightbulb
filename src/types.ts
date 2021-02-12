import { Client, Collection, Message, PermissionFlags } from 'discord.js';

export type Command = {
  execute(context: Context): boolean;
  meta: CommandMetadata;
};
export interface Context {
  client: Client;
  args: string[];
  message: Message;
  commands: Collection<string, Command>;
  commandHandlerStarted: number;
}

export interface CommandMetadata {
  name: string;
  description: string;
  aliases: string[] | [];
  userPermissions?: (keyof PermissionFlags)[] | bigint[];
  accessLevel: keyof AccessLevels | number;
}

export interface AccessLevels {
  USER?: 0;
  MODERATOR?: 1;
  ADMINISTRATOR?: 2;
  OWNER?: 3;
}
