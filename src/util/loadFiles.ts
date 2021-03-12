import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { loggr } from '..';

export function loadFiles<T>(folder: string): Collection<string, T> {
  const coll = new Collection<string, T>(),
    files = readdirSync(join(__dirname, folder))
      .filter(value => value.match(/\.[jt]s$/g))
      .map(value => value.replace(/\.[jt]s$/g, ''));
  for (let file of files) {
    loggr.debug(`Loaded file ${file}.ts from ${folder}`);
    const data = require(`${folder}/${file}`);
    coll.set(file, data);
  }
  // while (!coll.array().find((_, i) => i === (files.length - 1))) {}
  loggr.debug(`Loaded ${coll.size} files.`);
  return coll;
}
