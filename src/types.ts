import { Client, Collection, Message, PermissionFlags } from 'discord.js';
import { loggr } from '.';

export type Command = {
  execute: CommandExecute;
  meta?: CommandMetadata;
};

export type CommandExecute = (context: Context) => boolean;

export interface Context {
  client: Client;
  args: string[];
  message: Message;
  commands: Collection<string, Command>;
  commandHandlerStarted: number;
  accessLevel: number;
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

enum A {
  one = 1,
  two,
  three,
}
loggr.debug(A.one);
