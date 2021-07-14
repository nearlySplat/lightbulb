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
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { config } from '../../src/constants.js';

export class I18nManager {
  i18next: typeof i18next;
  resources: {
    [k: string]: I18nResources;
  } = {};

  constructor() {
    this.i18next = i18next;

    this.i18next.use(Backend).init({
      lng: 'en',
      fallbackLng: 'en',
      resources: this.resources,
      defaultNS: 'strings',
      backend: {
        loadPath: config.i18n_path,
      },
    });
  }

  /**
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  static interpolate(string: string, ..._args: any[]): string {
    process.emitWarning(
      'The I18nManager.interpolate function is deprecated.',
      'DeprecationWarning'
    );
    return string;
  }

  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static get(string: string, _locale?: string): string {
    process.emitWarning(
      'The I18nManager.get function is deprecated, please use Candle#i18n.get instead.',
      'DeprecationWarning'
    );
    return string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string, locale = 'en', vars: Record<string, any> = {}): string {
    return this.i18next.t(key, locale, vars);
  }
}

type I18nResources = {
  [k: string]: {
    translation: {
      [k: string]: I18nResource;
    };
  };
};
type I18nResource = { [k: string]: I18nResource } | string;
