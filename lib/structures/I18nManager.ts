import i18next from 'i18next';
import fs from 'fs';

export class I18nManager {
  i18n: typeof i18next;
  resources: {
    [k: string]: I18nResources;
  };

  constructor() {
    this.i18n = i18next;

    const supportedLanguages = fs.readdirSync('./i18n');
    for (const lang of supportedLanguages)
      this.resources[lang] = JSON.parse(
        fs.readFileSync(`./i18n/${lang}/strings.json`, 'utf-8')
      );

    this.i18n.init({
      lng: 'en',
      supportedLngs: supportedLanguages,
      fallbackLng: 'en',
      resources: this.resources,
    });
  }

  /**
   * @deprecated
   */
  static interpolate(string: string, ..._args: any[]): string {
    process.emitWarning(
      'The I18nManager.interpolate function is deprecated.',
      'DeprecationWarning'
    );
    return string;
  }

  /** @deprecated */
  static get(string: string, _locale?: string) {
    process.emitWarning(
      'The I18nManager.get function is deprecated, please use Candle#i18n.get instead.',
      'DeprecationWarning'
    );
    return string;
  }
}

type I18nResources = { [k: string]: I18nResource };
type I18nResource = { [k: string]: I18nResource } | string;
