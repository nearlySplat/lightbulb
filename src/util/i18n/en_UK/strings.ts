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
export const HELP_ARRIVED = [
  'Help has arrived!',
  'Who ya gonna call? Light-busters!',
  'Halp pls aaaaa',
  'ok',
  'fine...',
];
export const GENERIC_ERROR =
  'An error occurred! Code: `{{code}}`, message: `{{message}}`.';
export const BAN_INSUFFICIENT_PERMISSIONS =
  "One of us doesn't have the required permissions to ban `{{target}}`";
export const BAN_SUCCESSFUL = '***🔨 {{target}} was successfully banned.***';
export const MEMBERCOUNT_TEXT = `**__{{guild}}__**
                                {{guild}} has \`{{count}}\` members.s
                                `.replace(/\n +/g, '\n');
export const ACHOO = ['Dab when you sneeze!', 'Bless you!', 'Achoo!'];
export const SLASHSYNC_NO_TARGETS = 'All slash commands are synced.';
export const SLASHSYNC_SUCCESSFUL = 'Successfully synced slash commands.';
export const STALLMAN_TEXT = `I'd just like to interject for a moment. What you're refering to as {{text}}, is in fact, GNU/{{text}}, or as I've recently taken to calling it, GNU plus {{text}}. {{text}} is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.

Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called {{text}}, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project.

There really is a {{text}}, and these people are using it, but it is just a part of the system they use. {{text}} is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. {{text}} is normally used in combination with the GNU operating system: the whole system is basically GNU with {{text}} added, or GNU/{{text}}. All the so-called {{text}} distributions are really distributions of GNU/{{text}}!
`;
export const STALLMAN_HEADER = 'Stallman GNU Copy-pasta';
export const WHATGENDERAMI = [
  'unicorn',
  'attack helicopter',
  'emerald',
  'you!',
  'cutie',
  'cool person',
  '\\*forgets about the conversation and hugs you*',
  'h',
  'diamond',
  'ruby',
  'gem',
  'person'
];
export const WHATGENDERAMI_USE_I = "Use `whatgenderami` instead!";
export const WHATGENDERARETHEY = ({ target, gender }:  { target: string; gender: string; }) => `${target} is ${gender.match(/^[aeiou]/) ? 'an' : 'a'} ${gender}!`;
export const WHATGENDERAMI_TEXT = ({ gender }:  { target: string; gender: string; }) => `You are ${gender.match(/^[aeiou]/) ? 'an' : 'a'} ${gender}!`;
