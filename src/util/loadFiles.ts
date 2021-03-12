import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { loggr } from '..';

export function loadFiles<T>(folder: string): Collection<string, T> {
  const coll = new Collection<string, T>(),
    files = readdirSync(join(__dirname, folder)).filter(value => value.match(/\.[jt]s$/g)).map(value =>
      value.replace(/\.[jt]s/g, '')
    );
  for (let file of files) {
    loggr.debug(`Loaded file ${file}.ts from ${folder}`);
    import(`${folder}/${file}`).then(data => coll.set(file, data));
  }
  loggr.debug(`Loaded ${coll.size} files.`);
  return coll;
}
