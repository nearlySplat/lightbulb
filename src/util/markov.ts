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
export class Markov {
  public static SENTENCE_BOUNDARIES = /\b[!?.\n]+\b/gi;
  public static WORD_JOINERS = /[-:;,@\$%^&*!?.€£¥₩+'">\-\/\\=#)\][}{]/g;
  public static WORD = new RegExp(
    `(${Markov.WORD_JOINERS})?\\b\\w+\\b((${Markov.WORD_JOINERS}\\b\\w*\\b)*)`,
    'gi'
  );
  public static WORD_MATCH = (word: string) =>
    new RegExp(
      `(${Markov.WORD_JOINERS.source})*\\b${word}\\b(${Markov.WORD_JOINERS.source}\\b\\w*\\b)?`,
      'gi'
    );
  public static SENTENCE = new RegExp(
    `${Markov.WORD.source}+${Markov.SENTENCE_BOUNDARIES.source}`,
    'gi'
  );
  public static TUPLE_WORD_MATCH = (existing: RegExp) =>
    new RegExp(`${existing.source}\\s+${Markov.WORD.source}`, 'gi');
  constructor(arr?: string | string[]) {
    if (arr) this.seed(arr);
  }
  public static from(arr: string | string[]) {
    return new Markov(arr);
  }
  public seed(arr: string | string[]) {
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
  public generate(length = 0, options: MarkovGenerateOptions = {}) {
    let text = options.starting
      ? options.starting
      : options.ending
      ? options.ending
      : this.getRandomStartingWord();
    let word = text;
    let finished = false;
    const hasToHaveRegExp: typeof options.hasToHave extends string
      ? RegExp
      : null = options.hasToHave ? Markov.WORD_MATCH(options.hasToHave) : null;
    do {
      for (; !finished; ) {
        let matched: string = this.matches.get(word) as any;
        console.log('current sentence: ', text, ' and next match: ', matched);
        matched = matched?.[Math.floor(Math.random() * matched.length)];
        if (!matched || !matched.length) {
          finished = true;
          break;
        }
        if (matched?.toLowerCase() === word.toLowerCase()) {
          finished = true;
          break;
        }
        text += ' ' + matched;
        word = matched;
      }
    } while (
      (length ? text.split(/\s+/).length < length : false) ||
      (options.hasToHave ? !hasToHaveRegExp.test(text) : false) ||
      !finished
    );
    return text;
  }
  private _splittedSentences = new Array<string[]>();
  public startingWords = new Array<string>();
  public endingWords = new Array<string>();
  public sentences = new Array<string>();
  public matches = new Map<string, string[]>();
  public getRandomStartingWord() {
    return this.startingWords[
      Math.floor(Math.random() * this.startingWords.length)
    ];
  }
  public analyze() {
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
