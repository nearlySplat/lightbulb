/*
 * Copyright (C) 2020 Splaterxl
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Context, CommandMetadata } from '../types';
import { get } from '../util/i18n';
export const execute = ({
  message,
  args,
  locale,
}: Context): boolean | Promise<boolean> => {
  void message.reply(get('DIE_SUCCESS', locale));
  setImmediate(() => process.exit(+args.data.code));
  return true;
};

export const meta: CommandMetadata = {
  name: 'die',
  description: 'die',
  accessLevel: 3,
  aliases: [],
  hidden: true,
  params: [
    {
      name: 'code',
      type: 'int',
      optional: true,
    },
  ],
};
