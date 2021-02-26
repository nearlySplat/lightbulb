import { inspect } from 'util';
import { WHITELIST } from '../constants';
import { CommandMetadata, Context } from '../types';
import { transpile } from "typescript";

export const execute = async ({ message, args }: Context): Promise<boolean> => {
  if (!WHITELIST.includes(message.author.id)) return true;
  const raw = args.join(' ');
  let output: (string & { name: string }) | undefined;
  try {
    output = transpile(raw);
  } catch (error) {
    output = error;
  }
  let type: string | undefined = output?.name ?? output?.constructor?.name;
  if (type === 'Promise') {
    try {
      output = await output;
      type = `Promise<${output?.name ?? output?.constructor?.name}>`;
    } catch (e) {
      output = e;
      type = 'Promise { <rejected> }';
    }
  }
  output =
    typeof output === 'string'
      ? output
      : (inspect(output, {
          depth: 0,
        }) as string & { name: string });
  message.channel.send(
    output?.slice(0, 1850) + `\nTypeof [${type}] => ${output?.length}` ??
      'No output.',
    {
      code: 'js',
    }
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'eval',
  description: 'Evaluate JavaScript code.',
  accessLevel: 3,
  aliases: [],
};
