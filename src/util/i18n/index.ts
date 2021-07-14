import { I18nManager } from '../../../lib/structures/I18nManager';

exports = {};

for (const [K, V] of Object.entries(I18nManager)) {
  exports[K] = V;
}
