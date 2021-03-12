export * from './createLogMessage';
export * from './loadFiles';
export * from './noop';
export * from './permissionLevels';
export * from './sleep';
export * from './getCases';
export * from './getAccessLevel';
export * from './Parameters';
export const getProgressBar = (len = 3, seperator = 'O', lineChar = '─') => {
  if (typeof len !== 'number')
    throw new TypeError("Parameter 'len' must be of type number.");
  if (typeof seperator !== 'string')
    throw new TypeError("Parameter 'seperator' must be of type string");
  if (typeof lineChar !== 'string')
    throw new TypeError("Paramater 'lineChar' must be of type string.");
  const num = Math.floor(Math.random() * len);
  const progress = Array.from({ length: len }, (_, i) =>
    i === num ? seperator : lineChar
  ).join('');
  return progress;
};
export * as i18n from './i18n';
export * from './parseCLIArgs'