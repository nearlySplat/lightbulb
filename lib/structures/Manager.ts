import { config } from '@lightbulb/src/constants';
import { version as DJSVersion } from 'discord.js';
import fs from 'fs';
import path from 'path';
const { version } = JSON.parse(
  fs.readFileSync(path.resolve('./package.json'), 'utf-8')
);

export class Manager {
  get userAgent(): string {
    return `${config.bot.name}/${version} Discordbot (Discord.js/${DJSVersion}, Node.js/${process.version})`;
  }
}
