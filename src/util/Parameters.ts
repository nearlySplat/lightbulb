import { CommandMetadata } from '../types';

export class CommandParameters implements PrimitiveArray {
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
    this.data = obj;
    // @ts-ignore
    for (const [index, value] of Object.values(obj).map((v, i) => [i, v]))
      this[index] = value;
    return obj;
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
    const types = ['int', 'float', 'string', 'bool'];
    if (!arr.every(v => types.includes(v.type)))
      throw new TypeError(
        `Types must be ${types
          .map((v, i, a) => (i == a.length - 2 ? `or ${v}` : v))
          .join(', ')}`
      );
    this._data = { arr };
  }
  static getType(str: string): ParameterType {
    if (isNaN(parseFloat(str)))
      if (['true', 'false'].includes(str.toLowerCase())) return 'bool';
      else return 'string';
    else if (parseFloat(str).toString().includes('.')) return 'float';
    else return 'int';
  }
  static async from(
    meta: CommandMetadata,
    args: string | string[]
  ): Promise<CommandParameters> {
    let instance;
    if (meta && meta.params) {
      instance = new CommandParameters(...meta.params);
    } else {
      instance = new CommandParameters({
        name: 'args',
        type: 'string',
        rest: true,
      });
    }
    instance.parseData(Array.isArray(args) ? args.join(' ') : args);
    const checkResult = instance.checkTypes();
    if (Object.values(checkResult.errs)[0])
      throw Object.entries(checkResult.errs).map(
        ([k, v]) => `Error for argument ${k}: ${v}`
      )[0];
    else return instance;
  }
  public data: Record<string, string> | null = null;
  *[Symbol.iterator]() {
    for (const v of Object.entries(this)
      .filter(([K]) => !isNaN(parseInt(K)))
      .map(([, V]) => V))
      yield v;
  }
  slice(n: number, e?: number) {
    return [...this].slice(n, e);
  }
  join(sep?: string) {
    return [...this].join(sep);
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
};

type ParameterType = 'int' | 'float' | 'string' | 'bool';

type ParameterTypeCheckingError = `Expected type ${ParameterType}, recieved ${ParameterType}`;

interface PrimitiveArray {
  [k: number]: string;
}
