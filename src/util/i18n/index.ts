import { I18nManager } from '@lightbulb/lib/structures/I18nManager';

exports = {};

for (const [K, V] of Object.entries(I18nManager)) {
  exports[K] = V;
}
