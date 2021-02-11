import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { loggr } from '..';
import { Command } from '../types';

export const loadFiles = (folder: string) => {
  const coll = new Collection<string, Command>(),
    files = readdirSync(join(__dirname, folder)).map(value =>
      value.replace(/\.[jt]s/g, '')
    );
  for (let file of files) {
    loggr.debug(`Loaded file ${file}.ts from ${folder}`);
    import(`${folder}/${file}`).then(data => coll.set(file, data));
  }
  loggr.debug(`Loaded ${coll.size} files.`);
  return coll;
};
