import { CommandExecute, CommandMetadata } from '../types';
import { get } from '../util/i18n';

export const execute: CommandExecute = ({ message }) => {
  message.channel.send(get('HELP_ARRIVED', 'uwu'));
  return true;
};

export const meta: CommandMetadata = {
  name: 'hewp',
  description: 'hewp me uwu',
  accessLevel: 0,
  aliases: [],
};
