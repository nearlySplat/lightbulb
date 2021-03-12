import {
  Client,
  Collection,
  Guild,
  GuildMember,
  GuildPreview,
  Message,
  PermissionFlags,
  Snowflake,
<<<<<<< Updated upstream
=======
  StringResolvable,
  MessageEmbed,
  User,
>>>>>>> Stashed changes
} from 'discord.js';

export type Command = {
  execute: CommandExecute;
  meta?: CommandMetadata;
};

export type CommandExecute = (context: Context) => boolean | Promise<boolean>;

export interface Context {
  client: Client;
  args: string[];
  message: Message & { guild: Guild; member: GuildMember };
  commands: Collection<string, Command>;
  commandHandlerStarted: number;
  accessLevel: number;
  locale: 'uwu' | 'en_UK';
}

export interface CommandMetadata {
  name: string;
  description: string;
  aliases: string[];
  userPermissions?: (keyof PermissionFlags)[] | bigint[];
  accessLevel: keyof AccessLevels | number;
  hidden?: boolean;
  scope?: 'guild' | 'dm' | 'slashMutualGuild' | 'any';
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
<<<<<<< Updated upstream
=======
export interface SlashCommand {
  execute: SlashCommandExecute;
  meta: CommandMetadata;
}

export type SlashCommandExecute = (
  context: SlashCommandContext
) => SlashCommandResponse;
export type RecurringAnyFuncOrObj = Record<string, any> &
  (<T>(...args: any[]) => T) &
  { [key in string]: RecurringAnyFuncOrObj };

export interface SlashCommandContext {
  client: Client;
  interactionHandlerStarted: number;
  member: GuildMember | null;
  author: User;
  guild: Guild | null;
  interaction: Interaction;
  commandFuncs: RecurringAnyFuncOrObj;
}
export interface Interaction {
  data: {
    name: string;
    id: Snowflake;
    options?: any[];
  };
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  member?: Record<string, any> | GuildMember | null;
  id: Snowflake;
  user?: Record<string, any> | User | null;
  token: string;
}

export type SlashCommandResponse = {
  type: 1 | 4 | 5;
  data: {
    content?: StringResolvable;
    embeds?: (Record<string, any> | MessageEmbed)[];
    flags?: 64;
  };
};
>>>>>>> Stashed changes
