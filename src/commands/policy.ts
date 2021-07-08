import { CommandMetadata, CommandExecute } from '../types';

export const meta: CommandMetadata = {
  name: 'policy',
  description: 'Sends the link for Lightbulb\'s Privacy Policy and Terms of Service',
  accessLevel: 0,
  aliases: ['privacy', 'terms', 'tos']
}

export const execute: CommandExecute = () => ([{ content: 'https://gist.github.com/nearlySplat/775c38ae157f5996e01ed4081d3f6380' }, null]);
