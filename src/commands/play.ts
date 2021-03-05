import { Context, CommandMetadata } from '../types';
import { getProgressBar } from '../util';
// import { get, interpolate } from '../util/i18n';
export const execute = ({ message }: Context): boolean | Promise<boolean> => {
  const progress = getProgressBar(36, ':radio_button:');
  const num = (progress.indexOf(':radio_button:') / progress.length) * 100;
  const flooredNum = Math.floor(num);
  const rand = Math.floor(Math.random() * 300);
  const played = rand * (flooredNum / 100);
  message.channel.send(
    `${progress}\n${played
      .toFixed()
      .replace(/(\d)(\d{2})/g, '$1.$2')
      .replace(/^(\d{2})$/g, '0.$1')
      .replace(/^(\d{1})$/g, '0.0$1')}/${rand
      .toFixed()
      .replace(/(\d)(\d{2})/g, '$1.$2')
      .replace(/^(\d{2})$/g, '0.$1')
      .replace(/^(\d{1})$/g, '0.0$1')}`
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'play',
  description: 'Play a song',
  accessLevel: 0,
  aliases: [],
  hidden: true,
};
