import { config } from '@lightbulb/src/constants';
import { version as DJSVersion } from 'discord.js';
import fs from 'fs';
import path from 'path';
const pkg = JSON.parse(
  fs.readFileSync(path.resolve('./package.json'), 'utf-8')
);

export class Manager {
  get userAgent(): string {
    return `${config.bot.name}/${pkg.version} Discordbot (Discord.js/${DJSVersion}, Node.js/${process.version})`;
  }

  get version(): string {
    return pkg.version;
  }

  get packageName(): string {
    return pkg.name;
  }
}
