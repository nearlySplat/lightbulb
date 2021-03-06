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

export function escapeRegExp(str: string | RegExp): string {
  if (str instanceof RegExp) str = str.source;
  str = str as string;
  str = str.replace(/[\\[\]().\-/*?+{}]/gi, '\\$&');
  return str;
}
export class Markov {
  public static SENTENCE_BOUNDARIES = /\b[!?.\n]+\b/gi;
  public static WORD_JOINERS = /[-:;,@$%^&*!?.€£¥₩+'">\-/\\=#)\][}{\u2000-\u200f]/g;
  public static WORD = new RegExp(
    `(${Markov.WORD_JOINERS.source})?\\w+(((${Markov.WORD_JOINERS.source}+)(\\w+)?)*)`,
    'gi'
  );
  public static WORD_MATCH = (word: string): RegExp =>
    new RegExp(
      `(${Markov.WORD_JOINERS.source})*${escapeRegExp(word)}(${
        Markov.WORD_JOINERS.source
      }\\b\\w*\\b)?`,
      'gi'
    );
  public static SENTENCE = new RegExp(
    `${Markov.WORD.source}+${Markov.SENTENCE_BOUNDARIES.source}`,
    'gi'
  );
  public static TUPLE_WORD_MATCH = (existing: RegExp): RegExp =>
    new RegExp(`${existing.source}\\s+${Markov.WORD.source}`, 'gi');
  constructor(arr?: string | string[]) {
    if (arr) this.seed(arr);
  }
  public static from(arr: string | string[]): Markov {
    return new Markov(arr);
  }
  public seed(arr: string | string[]): this {
    if (!Array.isArray(arr)) arr = arr.match(Markov.SENTENCE);
    this.sentences = arr;
    this._splittedSentences = this.sentences.map(value => value.split(/\s+/));
    for (const [sentence, words] of this.sentences.map<[string, string[]]>(
      value => [value, value.match(Markov.WORD) ?? []]
    )) {
      for (const word of words) {
        const matches = (
          sentence.match(Markov.TUPLE_WORD_MATCH(Markov.WORD_MATCH(word))) ?? []
        )
          .filter(v => v)
          .map(v => v.split(/\s+/).reverse()[0]);
        let already = this.matches.get(word);
        if (already) already.push(...matches);
        else already = matches;
        already = [...new Set(already)];
        this.matches.set(word, already);
      }
    }
    this.startingWords = this._splittedSentences.map(value => value[0]);
    this.endingWords = this._splittedSentences.map(value => value.reverse()[0]);
    return this;
  }
  public generate(length = 0, options: MarkovGenerateOptions = {}): string {
    let text =
      options.starting ||
      options.ending ||
      options.hasToHave ||
      this.getRandomStartingWord();
    let word = text;
    let finished = false;
    if (!this.matches.has(word)) return '';
    do {
      for (; !finished; ) {
        let matched: string = (this.matches.get(word) as unknown) as string;
        matched = matched?.[Math.floor(Math.random() * matched.length)];
        if (!matched || !matched.length) {
          finished = true;
        }
        if (matched?.toLowerCase() === word.toLowerCase()) {
          finished = true;
        }
        text += ' ' + matched;
        word = matched;
      }
    } while ((length ? text.split(/\s+/).length < length : false) || !finished);
    if (options.hasToHave)
      text = this._generateBackwards(options.hasToHave) + ' ' + text;
    return text.replace(/undefined$/g, '');
  }
  private _generateBackwards(word: string) {
    const text: string[] = [];
    let finished = false;
    const arr = [...this.matches];
    for (; !finished; ) {
      let matched: string = (arr
        .filter(([, matches]) => matches.includes(word))
        .flatMap(v => v[0]) as unknown) as string;
      if (!matched.length) {
        finished = true;
      }
      matched = matched[Math.floor(Math.random() * matched.length)];
      if (!matched) finished = true;
      text.push(matched);
      word = matched;
    }
    return text
      .filter(v => v)
      .reverse()
      .join(' ');
  }
  private _splittedSentences = new Array<string[]>();
  public startingWords = new Array<string>();
  public endingWords = new Array<string>();
  public sentences = new Array<string>();
  public matches = new Map<string, string[]>();
  public getRandomStartingWord(): string {
    return this.startingWords[
      Math.floor(Math.random() * this.startingWords.length)
    ];
  }
  public analyze(): {
    starts: {
      all: string[];
      unique: Set<string>;
      top: Record<string, number>;
    };
    ends: {
      all: string[];
      unique: Set<string>;
      top: Record<string, number>;
    };
    all: {
      readonly all: string[];
      readonly unique: Set<string>;
      top: Record<string, number>;
    };
  } {
    const thisMatchesKeys = this.matches.keys();
    const starts = {
      all: this.startingWords,
      unique: new Set(this.startingWords),
      top: {} as Record<string, number>,
    };
    for (const iterator of starts.unique)
      starts.top[iterator] = starts.all.filter(
        value => value === iterator
      ).length;
    const ends = {
      all: this.endingWords,
      unique: new Set(this.endingWords),
      top: {} as Record<string, number>,
    };
    for (const iterator of ends.unique)
      ends.top[iterator] = ends.all.filter(value => value === iterator).length;
    const all = {
      get all() {
        return [...{ [Symbol.iterator]: () => thisMatchesKeys }];
      },
      get unique() {
        return new Set<string>(this.all);
      },
      top: {} as Record<string, number>,
    };
    for (const iterator of all.unique)
      all.top[iterator] = all.all.filter(value => value === iterator).length;
    return { starts, ends, all };
  }
}

export interface MarkovGenerateOptions {
  hasToHave?: string;
  length?: number;
  starting?: string;
  ending?: string;
}
