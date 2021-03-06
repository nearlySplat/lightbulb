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
import { Message } from 'discord.js';
import { CommandMetadata } from '../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class CommandParameters<T extends string>
  extends Array<string>
  implements PrimitiveArray {
  // eslint-disable-next-line no-undef
  [key: number]: string;
  private _data: ParametersData;
  parseData(str: string): Record<string, string> {
    const _data = this._data.arr;
    let params = str.match(/(\S+)/g) ?? [str]; //?.map(v => v.trim().replace(/(^"|"$)/g, "")) ?? [str]
    if (_data[_data.length - 1].rest == true)
      params = [
        ...params.slice(0, _data.length - 1),
        params.slice(_data.length - 1).join(' '),
      ];
    const data: [Parameter, string][] = params.map((v, i) => [_data[i], v]);
    let obj: Record<string, string> = {};
    for (const [parameter, value] of data) {
      obj[(parameter as Parameter).name] = value;
    }
    obj = Object.fromEntries(Object.entries(obj).filter(([, V]) => V !== ''));
    this.data = obj;
    // eslint-disable-next-line prefer-const
    for (let [index, value] of Object.values(obj).map((v, i) => [i, v])) {
      index = index as number;
      this[index] = value as string;
    }
    if (
      Object.values(obj).filter(v => v !== '').length <
      this._data.arr.filter(v => !v.optional).length
    )
      throw { _name: 'SIZE_NOT_SATISFIED' };
    return obj;
  }
  checkTypes(
    obj: Record<string, string> = this.data as Record<string, string>
  ): {
    successes: string[];
    errs: Record<string, ParameterTypeCheckingError>;
  } {
    const _data = this._data.arr;
    const successes: string[] = [],
      errs: Record<string, ParameterTypeCheckingError> = {};
    for (let [data, value, index] of Object.entries(obj).map(
      ([, val], index) =>
        [_data[index].type, val, index] as (
          | number
          | string
          | Parameter
          | ParameterType
        )[]
    )) {
      value = value as string;
      index = index as number;
      data = data as ParameterType;
      if (_data[index].options) {
        if (!_data[index].options!.includes(value))
          errs[_data[index].name] = `Expected one of options ${_data[
            index
          ].options!.join(', ')}, but recieved ${value}.`;
        else successes.push(_data[index].name);
      } else if (value === '') {
        //
      } else
        switch (data) {
          case 'string':
            successes.push(_data[index].name);
            break;
          case 'int':
            if (
              !isNaN(parseFloat(value)) &&
              !parseFloat(value).toString().includes('.')
            )
              successes.push(_data[index].name);
            else
              errs[_data[index].name] = `Expected type ${
                _data[index].type as ParameterType
              }, recieved ${CommandParameters.getType(
                value
              )}` as ParameterTypeCheckingError;
            break;
          case 'float':
            if (!isNaN(parseFloat(value))) successes.push(_data[index].name);
            else
              errs[_data[index].name] = `Expected type ${
                _data[index].type
              }, recieved ${CommandParameters.getType(
                value
              )}` as ParameterTypeCheckingError;
            break;
          case 'bool':
            if (['true', 'false'].includes(value.toLowerCase()))
              successes.push(_data[index].name);
            else
              errs[_data[index].name] = `Expected type ${
                _data[index].type
              }, recieved ${CommandParameters.getType(
                value
              )}` as ParameterTypeCheckingError;
        }
    }
    return { successes, errs };
  }
  constructor(...arr: Parameter[]) {
    super(arr.length);
    const types = ['int', 'float', 'string', 'bool'];
    if (!arr.every(v => types.includes(v.type)))
      throw new TypeError(
        `Types must be ${types
          .map((v, i, a) => (i == a.length - 2 ? `or ${v}` : v))
          .join(', ')}`
      );
    this._data = { arr };
  }
  static triggerError(
    fn: (s: string) => Promise<Message | void>,
    s: [string, string] | { _name: 'SIZE_NOT_SATISFIED' }
  ): Promise<Message | void> {
    return fn(
      CommandParameters._getErrorMsg(
        Array.isArray(s) ? s[0] : s,
        Array.isArray(s) ? s[1] : undefined
      )
    );
  }
  static _getErrorMsg(
    param: string | { _name: 'SIZE_NOT_SATISFIED' },
    message?: string
  ): string {
    return (param as { _name: string })._name === 'SIZE_NOT_SATISFIED'
      ? 'Not enough parameters passed. Refer to `help <command>` for details.'
      : `Error for parameter \`${param}\`: \`\`\`md\n${
          message || 'Incorrect type'
        }\n\`\`\``;
  }
  static getType(str: string): ParameterType {
    if (isNaN(parseFloat(str)))
      if (['true', 'false'].includes(str.toLowerCase())) return 'bool';
      else return 'string';
    else if (parseFloat(str).toString().includes('.')) return 'float';
    else return 'int';
  }
  static async from<T extends string>(
    meta: CommandMetadata,
    args: string | string[]
  ): Promise<CommandParameters<T>> {
    let instance;
    if (meta && meta.params) {
      instance = new CommandParameters(...meta.params);
    } else {
      instance = new CommandParameters({
        name: 'args',
        type: 'string',
        rest: true,
        optional: true,
      });
    }
    instance.parseData(Array.isArray(args) ? args.join(' ') : args);
    const checkResult = instance.checkTypes();
    if (Object.values(checkResult!.errs)[0])
      throw Object.entries(checkResult!.errs)[0];
    else return instance;
  }
  public data!: Record<T, string>;
  *[Symbol.iterator](): Generator<string, void, unknown> {
    for (const v of Object.entries(this)
      .filter(([K]) => !isNaN(parseInt(K)))
      .map(([, V]) => V))
      yield v;
  }
}

interface ParametersData {
  arr: Parameter[] & {
    [index: number]: Parameter;
  };
}

export type Parameter = {
  name: string;
  type: ParameterType;
  rest?: boolean;
  optional?: boolean;
  options?: string[];
};

type ParameterType = 'int' | 'float' | 'string' | 'bool';

type ParameterTypeCheckingError =
  | `Expected type ${ParameterType}, recieved ${ParameterType}`
  | `Expected one of options ${string}, but recieved ${string}.`;

interface PrimitiveArray {
  [k: number]: string;
}
