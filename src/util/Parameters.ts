import { CommandMetadata } from '../types';

export class CommandParameters<T extends string>
  extends Array<string>
  implements PrimitiveArray {
  [key: number]: string;
  private _data: ParametersData;
  parseData(str: string) {
    const _data = this._data.arr;
    let params = str.split(' ');
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
    // @ts-ignore
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
  get length(): number {
    return [...this].length;
  }
  checkTypes(obj: Record<string, any> = this.data as Record<string, string>) {
    const _data = this._data.arr;
    let successes: string[] = [],
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
          ].options!.join(', ')}, but recieved ${value}.` as const;
        else successes.push(_data[index].name);
      } else if (value === '') {
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
    fn: (s: string) => any | void,
    s: [string, string] | { _name: 'SIZE_NOT_SATISFIED' }
  ) {
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
  ) {
    // @ts-ignore
    return param._name === 'SIZE_NOT_SATISFIED'
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
    let checkResult: {
      errs: Record<string, string>;
      successes: string[];
    };
    console.log(instance.data, instance._data.arr.length);
    checkResult = instance.checkTypes();
    if (Object.values(checkResult!.errs)[0])
      throw Object.entries(checkResult!.errs)[0];
    else return instance;
  }
  public data!: Record<T, string>;
  *[Symbol.iterator]() {
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
  | `Expected one of options ${any}, but recieved ${string}.`;

interface PrimitiveArray {
  [k: number]: string;
}
