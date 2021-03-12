import { CommandExecute, CommandMetadata } from '../types';
import { get } from '../util/i18n';

export const execute: CommandExecute = ({ message, locale }) => {
  message.channel.send(get('ACHOO', locale));
  return true;
};

export const meta: CommandMetadata = {
  name: 'achoo',
  description: 'Achoo!',
  accessLevel: 0,
  aliases: [],
};
