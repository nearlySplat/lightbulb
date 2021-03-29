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
import { Snowflake } from 'discord.js';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  constructor() {
    super();
    this.created_at = new Date();
    this.updated_at = this.created_at;
  }
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('text')
  subjectPronoun = 'they';
  @Column('text')
  objectPronoun = 'them';
  @Column('text')
  possessiveDeterminer = 'their';
  @Column('text')
  possessivePronoun = 'theirs';
  @Column('text')
  singularOrPluralPronoun = 'plural';

  get pronouns() {
    return {
      subject: this.subjectPronoun,
      object: this.objectPronoun,
      possessiveDeterminer: this.possessiveDeterminer,
      posessivePronoun: this.possessivePronoun,
      singularOrPlural: this.singularOrPluralPronoun,
    };
  }

  @Column()
  userid!: Snowflake;

  @Column()
  isDeveloper: boolean;
}
