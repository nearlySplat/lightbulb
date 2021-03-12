import { CommandExecute, CommandMetadata } from '../types';
import { slashCommands } from '..';
import { get } from '../util/i18n';

export const meta: CommandMetadata = {
  name: 'syncslash',
  description: 'Syncs slash commands (owner only)',
  accessLevel: 3,
  aliases: ['syncinteractions'],
};

export const execute: CommandExecute = async ({ client, message }) => {
  const curr = await client.api
    .applications(client.user!.id)
    .commands.get<{ name: string }[]>();
  const toAdd = slashCommands.filter(
    ({ meta: { name } }) => !curr.find(({ name: iName }) => iName === name)
  );
  if (!toAdd.size) {
    message.channel.send(get('SLASHSYNC_NO_TARGETS'));
    return false;
  }
  for (const [, command] of toAdd)
    client.api
      .applications(client.user!.id)
      .commands.post({ data: command.meta });
  message.channel.send(get('SLASHSYNC_SUCCESSFUL'));
  return true;
};
