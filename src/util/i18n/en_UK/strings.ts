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
import { config } from '../../../constants';
import { Parameter } from '../../Parameters';

export const ABOUT_LONG_DESCRIPTION =
  `👋 Hi! I'm 🤖💡, the [TypeScript](https://typescriptlang.org) rewrite of Eureka!

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
export const PURGE_KEYWORD_EXPLANATIONS = {
  help: 'Gets help for the command.',
  bots: 'Purges messages sent by bots.',
  all: 'No criterion.',
};
export const PURGE_HELP_BODY = ({ data }: { data: Parameter[] }) =>
  `There are many features in this command.
                                ${data[0]
                                  .options!.map(
                                    v =>
                                      `\`${v}\`: ${
                                        PURGE_KEYWORD_EXPLANATIONS[
                                          v as keyof typeof PURGE_KEYWORD_EXPLANATIONS
                                        ]
                                      }`
                                  )
                                  .join('\n')}

                 		All of these options (except for \`help\`, of course) take an optional \`amount\` argument, which defaults to \`0\`.`.replace(
    /\n\s*/g,
    '\n'
  );
export const PURGE_HELP_HEADER = 'Purge Help';
export const HELP_ARRIVED = [
  'Help has arrived!',
  'Who ya gonna call? Light-busters!',
  'Halp pls aaaaa',
  'ok',
  'fine...',
  'no',
  'use `bulb commands` instead',
];
export const GENERIC_ERROR =
  'An error occurred! Code: `{{code}}`, message: `{{message}}`.';
export const BAN_INSUFFICIENT_PERMISSIONS =
  "One of us doesn't have the required permissions to ban `{{target}}`";
export const BAN_SUCCESSFUL = '🔨 **{{target}}** was successfully banned.';
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
  'person',
];
export const WHATGENDERAMI_USE_I = 'Use `whatgenderami` instead!';
export const WHATGENDERARETHEY = ({
  target,
  gender,
}: {
  target: string;
  gender: string;
}) => `${target} is ${gender.match(/^[aeiou]/) ? 'an' : 'a'} ${gender}!`;
export const WHATGENDERAMI_TEXT = ({
  gender,
}: {
  target: string;
  gender: string;
}) => `You are ${gender.match(/^[aeiou]/) ? 'an' : 'a'} ${gender}!`;
export const UNBAN_SUCCESSFUL = ({
  target,
  subjectPronoun,
  singular,
  bannedFor,
}: Record<string, string>) =>
  `🔧 **${target}** was successfully unbanned. ${subjectPronoun.replace(
    /^\w/g,
    v => v.toUpperCase()
  )} ${
    singular ? 'was' : 'were'
  } previously banned for: \n\`\`\`md\n${bannedFor}\n\`\`\``;
export const MESSAGEINFO_CHANNEL_NOT_FOUND = 'No such channel could be found.';
export const MESSAGEINFO_MESSAGE_NOT_FOUND =
  'No such message exists in this channel.';
export const BAN_CONFIRMATION =
  'Are you sure you want to ban {{objectPronoun}}? (y/N)';
export const INTERACTION_NO_BUTTON_HANDLER = '';
export const CHESS_HELP = `Hi there! So, you want to take a go at the centuries-old game of chess? Here's how to play it with ${
  config.bot.name
}!

**Buttons**
You may notice we are using buttons for this command. Yes, we are, but because of the 5×5 (${
  5 * 5
}) limit on the amount of buttons on each message, you'll be using text to control your pieces.

Since this looks absolutely horrible on mobile, we have taken care to have the bot delete valid commands (related to the current game, of course) when it can. And, if it can't, it'll react with ✅ or ❌ depending on whether the command was valid.

**How to play**
We are using a chess framework called **[chess.js](https://npmjs.com/package/chess.js)** to manage your games, so all the [rules of chess](https://rcc.fide.com/wp-content/uploads/2019/11/FIDE_Laws-Of_Chess_2018-1.pdf) \\*should\\* be reflected.

**Commands**
To use any of the commands listed below, just type them in chat! No prefix, no anything.

*Mods, if you're reading this, only players in a current game are responded to.*

- \`show me the legal moves\` — ... shows you the legal moves
- \`what colour am I\` (with the capital \`I\`) — self explanatory
- \`resign\` — forfeits your move and awards the other player with a win
- and finally, any valid move (see the first command) — resolves the pieces to move, moves those pieces, captures pieces if necessary and forwards the move to the next person. *Note: reacts with ❌ if the move is illegal*`;
