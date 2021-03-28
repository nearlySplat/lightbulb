import {Snowflake} from "discord.js";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User extends BaseEntity {
  constructor() {
    super();
    this.created_at = new Date()
    this.updated_at = this.created_at
  }
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at: Date;

  @Column("text")
  subjectPronoun = "they";
  @Column("text")
  objectPronoun = "them";
  @Column("text")
  possessiveDeterminer = "their";
  @Column("text")
  possessivePronoun = "theirs";
  @Column("text")
  singularOrPluralPronoun = "plural";

  get pronouns() {
    return {
	    subject: this.subjectPronoun,
	    object: this.objectPronoun,
	    possessiveDeterminer: this.possessiveDeterminer,
	    posessivePronoun: this.possessivePronoun,
	    singularOrPlural: this.singularOrPluralPronoun
	}
  }


  @Column()
  userid!: Snowflake

  @Column()
  isDeveloper: boolean

}

