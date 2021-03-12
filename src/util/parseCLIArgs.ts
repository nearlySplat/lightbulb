export const parseCLIArgs = (
  argv: string,
  { switches, options }: { switches: string[]; options: string[] }
) => {
  const parsed =
    argv
      .match(/([\w\.\/]+|-(\w)|--(\w+([:= \s]+[^-]("[^"]+"|\S+))?))/g)
      ?.map(v => v.replace(/^\s?-{1,2}/g, '')) ?? [];
  const nonAccepted = parsed
    .map(v => v.match(/^\S+/g)?.[0])
    .filter(v => ![switches, options].flat().includes(v ?? ''));
  const invalid = parsed
    .filter(v => [switches, options].flat().includes(v))
    .filter(v =>
      switches.includes(v) ? !!v.match(/^\S\s/g) : !v.match(/^\S\s/g)
    );
  const parsedOptions = Object.fromEntries(
    parsed
      .filter(v => !invalid.includes(v))
      .map(
        v =>
          (switches.includes(v.match(/\S+/g)?.[0] ?? '')
            ? [v, true]
            : v.match(/("[^"]+"|\S+)/g)) ?? []
      )
  );

  return {
    parsed,
    nonAccepted,
    invalid,
    options: parsedOptions,
  };
};
