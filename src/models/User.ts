/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { model, Schema } from 'mongoose';

const schemaData = {
  achievements: [Number],
  commands: [String],
  uid: String,
  pronouns: {
    subject: String,
    object: String,
    possessiveDeterminer: String,
    possessivePronoun: String,
    singularOrPlural: String,
  },
  isDeveloper: Boolean,
};

export interface IUser {
  achievements: number[];
  commands: string[];
  uid: string;
  pronouns: {
    subject: string;
    object: string;
    possessiveDeterminer: string;
    possessivePronoun: string;
    singularOrPlural: string;
  };
  isDeveloper: boolean;
}

export enum Achievement {
  FirstCommand,
}

export const DefaultPronouns = {
  subject: 'they',
  object: 'them',
  possessiveDeterminer: 'their',
  possessivePronoun: 'theirs',
  singularOrPlural: 'plural',
};

const schema = new Schema(schemaData);
export const User = model<IUser>('User', schema);
