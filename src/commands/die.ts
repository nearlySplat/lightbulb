/*
 * Copyright (C) 2020 Splatterxl
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
export const execute = async ({
  message,
  args,
  locale,
}: Context): Promise<boolean> => {
  await message.reply({
    content: message.client.i18n.get('die.success', locale),
  });
  message.client.destroy();
  // eslint-disable-next-line no-undef
  setTimeout(() => process.exit(+args.data.code), 100);
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
