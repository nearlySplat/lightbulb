/* eslint-disable @typescript-eslint/no-empty-function */
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
import ChessImageGenerator from 'chess-image-generator';
import {
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
  TextChannel,
  User,
} from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { AccessLevels, i18n, reverseIndex } from '../util';
import {
  Chess as ChessClient,
  PieceType as ChessJSPieceType,
  ChessInstance as ChessClientInstance,
} from 'chess.js';
import { MessageFlags } from 'discord-api-types';
import { CLIENT_COLOUR } from '../constants';
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Chess {
  export type Letters = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
  export type Numbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  export type Coordinates = `${Chess.Letters}${Chess.Numbers}`;
  export type Board = Record<Chess.Coordinates, Chess.Square | null>;
  export interface Square {
    piece: Chess.Piece;
    color: Chess.Team;
  }
  export type PieceType = 'N' | 'P' | 'K' | 'R' | 'Q' | 'B';
  export interface Piece {
    team: Chess.Team;
    type: Chess.PieceType;
  }
  export type Team = 'black' | 'white';
  export interface Player {
    user: User;
    pid: 1 | 2;
    team: Chess.Team;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _(__: `_//`) {}
const coords: Chess.Coordinates[] = [
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
  ...'abcdefgh',
].map((v, i) => v + '' + (Math.floor(i / 8) + 1)) as Chess.Coordinates[];

export const execute: CommandExecute = async () => {
  const players: [p1: User, p2: User] = [null, null] as [User, User];
  let board: Chess.Board = {} as Chess.Board;
  let currentlyMoving: 0 | 1 = 0;
  const instance = new ChessClient();
  let isOver = () => instance.game_over();
  let nextMoveMsg: Message;
  return [
    {
      content: 'Who wants to play some chess?',
      components: [
        new MessageActionRow().addComponents(...generatePlayerRow(players)),
        helpRow,
      ],
    },
    async ctx => {
      board = generateBoard(instance.board());
      const customID = ctx.interaction.data.custom_id;
      if (customID.startsWith('ig_')) {
        // ignore the interaction
      } else if (customID === 'help') {
        return {
          type: 4,
          data: {
            embeds: [
              {
                description: i18n.get('CHESS_HELP'),
                color: (
                  ctx.message.member || {
                    roles: { highest: { color: CLIENT_COLOUR } },
                  }
                ).roles.highest.color,
              },
            ],
            flags: MessageFlags.Ephemeral,
          },
        };
      } else if (customID === 'history') {
        return {
          type: 4,
          data: {
            content: `The ${
              instance.game_over() ? 'PGN' : 'history'
            } for this game is as follows:\n\`\`\`\n${
              instance.pgn() ||
              instance
                .history()
                .map((v, i) => (i % 2 === 0 ? `${i}. ${v}` : v))
                .join(' ')
            }\n\`\`\``,
            flags: MessageFlags.Ephemeral,
          },
        };
      } else if (['p1', 'p2'].includes(customID)) {
        if (isOver())
          return {
            type: 4,
            data: { content: 'This game is over.', flags: 64 },
          };
        const pid = getPlayerID(customID as `p${1 | 2}`);
        if (players[pid] /*|| players.includes(ctx.user)*/)
          return {
            type: 4,
            data: { content: "You can't do that!", flags: 64 },
          };
        players[pid] = ctx.user;
        if (players.filter(v => v).length === 2) {
          ctx.message.channel.send(
            `A chess game has started between **${players[0].tag}** (white) and **${players[1].tag}** (black)`
          );
          const coll = ctx.message.channel.createMessageCollector({
            filter: m => players.includes(m.author),
          });
          coll.on('collect', async (msg: Message) => {
            if (msg.author.id === players[currentlyMoving].id) {
              if (msg.content === 'show me the legal moves') {
                msg.channel.send(
                  `The current legal moves are:\n${instance
                    .moves({
                      verbose: false,
                    })
                    .map(v => `\`${v}\``)
                    .join(', ')}`
                );
                msg.delete().catch(() => {});
                return;
              } else if (msg.content.match('what colou?r am I')) {
                msg.channel.send(
                  `You are ${currentlyMoving ? 'black' : 'white'}.`
                );
                msg.delete().catch(() => {});
                return;
              } else if (msg.content === 'resign') {
                isOver = () => true;
                winHandler(
                  2,
                  msg.channel.send.bind(msg.channel),
                  ctx.message,
                  currentlyMoving,
                  players
                );
                coll.stop();
                msg.react('✅');
                msg.delete().catch(() => {});
                return;
              }
              const move = instance.move(msg.content);
              if (move === null) msg.react('❌');
              else {
                currentlyMoving = (Math.abs(currentlyMoving - players.length) -
                  1) as 0 | 1;
                board = generateBoard(instance.board());
                await ctx.message.removeAttachments();
                await ctx.message.edit(
                  await generateBoardFrom(
                    board,
                    ctx.message.member.roles.highest.color,
                    players[currentlyMoving],
                    players,
                    instance
                  )
                );
                msg.react('✅');
                const state = checkStateOfGame(instance);
                if (nextMoveMsg) await nextMoveMsg.delete();
                if (!isFinite(Math.abs(state)))
                  nextMoveMsg = await ctx.message.reply({
                    content: `It's ${players[currentlyMoving]}'s turn now!`,
                    allowedMentions: { users: [players[currentlyMoving].id] },
                  });
                else {
                  isOver = () => true;
                  coll.stop();
                  winHandler(
                    state,
                    ctx.message.reply.bind(ctx.message),
                    ctx.message,
                    currentlyMoving,
                    players
                  );
                }
                msg.delete().catch(() => {});
              }
            }

            return;
          });
          await ctx.message.edit({
            components: [
              new MessageActionRow().addComponents(generatePlayerRow(players)),
              helpRow,
            ],
            ...(await generateBoardFrom(
              board,
              ctx.message.member.roles.highest.color,
              players[currentlyMoving],
              players,
              instance
            )),
          });
        } else
          await ctx.message.edit({
            components: [
              new MessageActionRow().addComponents(generatePlayerRow(players)),
              helpRow,
            ].filter(v => v),
          });
        return { type: 6, data: {} };
      }
    },
  ];
};

export const meta: CommandMetadata = {
  name: 'chess',
  description: 'Play chess with your friends!',
  accessLevel: AccessLevels.USER,
  aliases: ['minichess'],
};

const vsButton = new MessageButton()
  .setStyle('SECONDARY')
  .setCustomId('ig_vs')
  .setLabel('v.')
  .setDisabled(true);
function generatePlayerRow(players: [User | null, User | null]) {
  const arr: [MessageButton, MessageButton, MessageButton] = [] as unknown as [
    MessageButton,
    MessageButton,
    MessageButton
  ];
  for (let i = 0; i < players.length; i++) {
    arr.push(
      ...[
        new MessageButton()
          .setStyle('PRIMARY')
          .setCustomId((players[i] === null ? '' : 'ig_') + 'p' + (i + 1))
          .setLabel(players[i] ? players[i].tag : 'Player ' + (i + 1))
          .setDisabled(!!players[i]),
        i === 0 ? vsButton : undefined,
      ].filter(v => v !== undefined)
    );
  }
  return arr;
}

function getPlayerID(customID: 'p1' | 'p2') {
  return +customID.slice(1) - 1;
}
async function generateBoardFrom(
  board: Chess.Board,
  color: number,
  toMove: User,
  players: User[],
  instance: ChessClientInstance
) {
  const pieces: string[][] = generatePieceArray(board);
  const generator = new ChessImageGenerator({
    size: 512,
    light: '#f9e9a2',
    dark: '#474747',
    style: 'alpha',
    flipped: false,
  });
  generator.loadArray(pieces);
  const buffer = await generator.generateBuffer();
  return {
    content: `${toMove.tag}'s turn, and they are ${
      players.indexOf(toMove) ? 'black' : 'white'
    }. Send the move notation of your desired move (e.g Nf3), or click the 'Help' button!`,
    embed: new MessageEmbed()
      .setDescription(instance.moves().join(' '))
      .setColor(color),
    files: [new MessageAttachment(buffer, 'chess.png')],
  };
}

function generatePieceArray(board: Chess.Board) {
  const arr: string[][] = Array.from({ length: 8 }, (_, i) =>
    Array.from({ length: 8 }, (_, ind) => board[coords[ind + 8 * i]]).map(
      v =>
        (v.piece &&
          (v.piece.team === 'white'
            ? v.piece.type
            : v.piece.type.toLowerCase())) ||
        ''
    )
  ).reverse();
  return arr;
}

function generateBoard(
  board: ({ type: ChessJSPieceType; color: 'b' | 'w' } | null)[][]
): Chess.Board {
  const toReturn = Object.fromEntries(
    board.flat().map((v, i) => [
      coords[i],
      {
        piece:
          (v && {
            type: v.type.toUpperCase(),
            team: v.color === 'w' ? 'white' : 'black',
          }) ||
          v,
      },
    ])
  ) as unknown as Chess.Board;
  return toReturn;
}

function winHandler(
  type: ChessGameResult,
  fn: TextChannel['send'],
  messageReference: Message,
  current: 0 | 1,
  players: User[]
) {
  switch (type) {
    case ChessGameResult.DrawByAgreement: {
      fn({ content: `It was a draw!`, reply: { messageReference } });
      break;
    }
    case ChessGameResult.InsufficientMaterial: {
      fn({
        content: 'There was insufficient material to continue the game!',
        reply: { messageReference },
      });
      break;
    }
    case ChessGameResult.FiftyMoveLimit: {
      fn({
        content:
          'The game crossed the fifty (50) move limit, so the game was drawn.',
        reply: { messageReference },
      });
      break;
    }
    case ChessGameResult.Stalemate: {
      fn({ content: 'It was a stalemate!', reply: { messageReference } });
      break;
    }
    case ChessGameResult.Repetition: {
      fn({
        content:
          'This position occurred three or more times, so the game was drawn.',
        reply: { messageReference },
      });
      break;
    }
    case ChessGameResult.CheckMate:
    case ChessGameResult.Resignation: {
      fn({
        content: `**${
          players[reverseIndex(current, players)].tag
        }** has won by ${
          type === ChessGameResult.CheckMate ? 'checkmate' : 'resignation'
        }!`,
        reply: { messageReference },
      });
      break;
    }
  }
}

const helpButton = new MessageButton()
  .setEmoji('📚')
  .setLabel('Help')
  .setCustomId('help')
  .setStyle('SUCCESS');
const historyButton = new MessageButton()
  .setEmoji('🕰')
  .setLabel('Move History')
  .setCustomId('history')
  .setStyle('DANGER');
const rulesButton = new MessageButton()
  .setLabel("FIDE's Laws of Chess")
  .setURL(
    'https://rcc.fide.com/wp-content/uploads/2019/11/FIDE_Laws-Of_Chess_2018-1.pdf'
  )
  .setStyle('LINK');
const helpRow = new MessageActionRow({
  components: [helpButton, historyButton, rulesButton],
});
enum ChessGameResult {
  DrawByAgreement = 0,
  InsufficientMaterial = 0.125,
  FiftyMoveLimit = 0.25,
  Stalemate = 0.5,
  Repetition = 0.75,
  CheckMate = 1,
  Resignation = 2,
}
function checkStateOfGame(instance: ChessClientInstance): ChessGameResult {
  if (!instance.game_over()) return -Infinity;
  // Draws
  else if (instance.in_draw()) {
    if (instance.insufficient_material())
      return ChessGameResult.InsufficientMaterial;
    else return ChessGameResult.FiftyMoveLimit;
  } else if (instance.in_stalemate()) return ChessGameResult.Stalemate;
  else if (instance.in_threefold_repetition())
    return ChessGameResult.Repetition;
  else if (instance.in_checkmate()) return ChessGameResult.CheckMate;
}

// owo this file
// almost
// has 400 lines
// this is an amazing moment
// it will surely go into the history books
// UwU
// OwO
