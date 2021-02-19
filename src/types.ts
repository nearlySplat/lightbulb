import {
  Client,
  Collection,
  GuildPreview,
  Message,
  PermissionFlags,
  Snowflake,
} from 'discord.js';
import { loggr } from '.';

export type Command = {
  execute: CommandExecute;
  meta?: CommandMetadata;
};

export type CommandExecute = (context: Context) => boolean | Promise<boolean>;

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

export type WidgetResponse = WidgetSuccessfulResponse | WidgetError;

export type WidgetError =
  | {
      [value: string]: string[];
    }
  | { message: string; code: number };

export interface WidgetSuccessfulResponse {
  id?: Snowflake;
  name?: string;
  instant_invite?: string;
  members?: any[];
  presence_count?: number;
}

export type GuildLookupData = WidgetResponse | GuildPreview | null;
