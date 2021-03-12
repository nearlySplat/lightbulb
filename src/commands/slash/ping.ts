import { SlashCommandExecute } from '../../types';

export const meta = {
  description: 'Ping pong',
  name: 'ping',
};

export const execute: SlashCommandExecute = context => ({
  type: 4,
  data: {
    content: `🏓 Pong! It took me \`${
      Date.now() - context.interactionHandlerStarted
    }ms\` to send you this message!`,
  },
});
