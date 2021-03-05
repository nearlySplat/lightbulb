export const ABOUT_LONG_DESCRIPTION = `👋 Hi! I'm 🤖💡, the [TypeScript](https://typescriptlang.org) rewrite of Eureka!

    **My features**:
    - Logging
    - Logging
    - Logging

    Aaand... that's about it! All you need to set me up is a channel called \`💡\`! Actually, the real RegExp for that is \`/^💡(-log(s|ging)?)?$/g\`, but we won't get into that stuff.

    **What I log:**
    - 🔨 Bans
    - 🔧 Unbans
    - 👢 Kicks (Coming Soon)`.replace(/\n +/g, '\n');
export const ABOUT_HEADER = 'About Me';
export const BANNE_SUCCESSFUL = '***🔨Successfully bent {{target}}***';
export const BANNE_NO_TARGET =
  'Who am I going to ~~call~~ banne? ~~Ghostbusters!~~ Nobody!';
export const I18N_KEY_NOT_FOUND =
  'This key ({{key}}) has not been localised into {{locale}} yet.';
export const GENERIC_REQUESTED_BY = 'Requested by {{requester}}';
export const BEAN_NO_TARGET = 'It seems Mr. Bean is going to be lonely today.';
export const BEAN_SUCCESSFUL =
  '***<:bean:813134247505559572> Successfully beaned {{target}}***';
export const DIE_SUCCESS = '*dies*';
export const HEX_HEADER = 'Hexadecimal Colour #{{color}}'; // This is en_UK not en_US - splat
export const HEX_BODY = `**Hexadecimal Value**: #{{hex_value}}
                         **Decimal Value**: {{decimal_value}}`.replace(
  /\n +/g,
  '\n'
);
export const PURGE_HELP_BODY = `There are many features in this command.
                                - \`purge bots [amount]\`: deletes the last 100 messages that are by bots and are under 14 days old. Optionally takes a second argument for an amount of messages to delete.
                                - \`purge regexp <regexp>\`: deletes messages matching that RegExp.
                               `.replace(/\n +/g, '\n');
export const PURGE_HELP_HEADER = 'Purge Help';
export const HELP_ARRIVED = 'Help has arrived!';
export const GENERIC_ERROR =
  'An error occurred! Code: `{{code}}`, message: `{{message}}`.';
export const BAN_INSUFFICIENT_PERMISSIONS =
  "One of us doesn't have the required permissions to ban `{{target}}`";
export const BAN_SUCCESSFUL = '***🔨 {{target}} was successfully banned.***';
export const MEMBERCOUNT_TEXT = `**__{{guild}}__**
                                {{guild}} has \`{{count}}\` members.s
                                `.replace(/\n +/g, '\n');
