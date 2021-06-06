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
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
  User,
} from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { accessLevels } from '../util';
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
const startingPosition: Chess.Board = {
  a1: {
    piece: { type: 'R', team: 'white' },
    color: 'black',
  },
  b1: {
    piece: {
      type: 'N',
      team: 'white',
    },
    color: 'white',
  },
  c1: {
    piece: { type: 'B', team: 'white' },
    color: 'black',
  },
  d1: {
    piece: { type: 'Q', team: 'white' },
    color: 'white',
  },
  e1: { piece: { type: 'K', team: 'white' }, color: 'black' },
  f1: { piece: { type: 'B', team: 'white' }, color: 'white' },
  g1: { piece: { type: 'N', team: 'white' }, color: 'black' },
  h1: { piece: { type: 'R', team: 'white' }, color: 'white' },
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 8],
      { piece: { type: 'P', team: 'white' }, color: i % 2 ? 'black' : 'white' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 16],
      { piece: null, color: i % 2 ? 'white' : 'black' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 24],
      { piece: null, color: i % 2 ? 'black' : 'white' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 32],
      { piece: null, color: i % 2 ? 'white' : 'black' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 40],
      { piece: null, color: i % 2 ? 'black' : 'white' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      coords[i + 48],
      { piece: { type: 'P', team: 'black' }, color: i % 2 ? 'white' : 'black' },
    ])
  ),
  a8: {
    piece: { type: 'R', team: 'black' },
    color: 'black',
  },
  b8: {
    piece: {
      type: 'N',
      team: 'black',
    },
    color: 'white',
  },
  c8: {
    piece: { type: 'B', team: 'black' },
    color: 'black',
  },
  d8: {
    piece: { type: 'Q', team: 'black' },
    color: 'white',
  },
  e8: { piece: { type: 'K', team: 'black' }, color: 'black' },
  f8: { piece: { type: 'B', team: 'black' }, color: 'white' },
  g8: { piece: { type: 'N', team: 'black' }, color: 'black' },
  h8: { piece: { type: 'R', team: 'black' }, color: 'white' },
} as any;
export const execute: CommandExecute = async () => {
  const players: [p1: User, p2: User] = [null, null] as [User, User];
  const board: Chess.Board = startingPosition;
  let currentlyMoving: 0 | 1 = 0;
  let selectedPiece: Chess.Coordinates = null as any;
  return [
    {
      content: 'Who wants to play some chess?',
      components: [
        new MessageActionRow().addComponents(...generatePlayerRow(players)),
      ],
    },
    async ctx => {
      const customID = ctx.interaction.data.custom_id;
      if (customID.startsWith('ig_')) {
        // ignore the interaction
      } else if (['p1', 'p2'].includes(customID)) {
        console.log('here');
        const pid = getPlayerID(customID as `p${1 | 2}`);
        if (players[pid] /*|| players.includes(ctx.user)*/)
          return {
            type: 4,
            data: { content: "You can't do that!", flags: 64 },
          };
        players[pid] = ctx.user;
        if (players.filter(v => v).length === 2) {
          await ctx.message.edit({
            components: [
              new MessageActionRow().addComponents(generatePlayerRow(players)),
            ],
            embed: await generateBoardFrom(board),
          });
        } else
          await ctx.message.edit({
            components: [
              new MessageActionRow().addComponents(generatePlayerRow(players)),
            ].filter(v => v),
          });
        return { type: 6, data: {} };
      } else {
        if (
          players.indexOf(ctx.user) !== currentlyMoving ||
          !players.includes(ctx.user)
        ) {
          return {
            type: 4,
            data: { content: "You can't do that!", flags: 64 },
          };
        }
        let piece: Chess.Coordinates = customID as any;
        if (!board[piece].piece) {
          let tmp = board[piece];
          board[selectedPiece].piece = null;
          board[piece].piece = tmp.piece;
          const toMove = players[currentlyMoving === 0 ? 1 : 0];
          const pos = players.indexOf(toMove) as 0 | 1;
          currentlyMoving = pos;
          await ctx.message.edit(
            (pos === 0
              ? `__**${toMove.tag}**__ v. **${players[1].tag}**`
              : `**${players[0].tag}** v. __**${toMove.tag}**__`) +
              ' (underlined user is to move)'
          );
        }
      }
    },
  ];
};

export const meta: CommandMetadata = {
  name: 'chess',
  description: 'Play chess with your friends!',
  accessLevel: accessLevels.USER,
  aliases: ['minichess'],
};

const vsButton = new MessageButton()
  .setStyle('SECONDARY')
  .setCustomID('ig_vs')
  .setLabel('v.')
  .setDisabled(true);
function generatePlayerRow(players: [User | null, User | null]) {
  const arr: [MessageButton, MessageButton, MessageButton] = [] as unknown as [
    any,
    any,
    any
  ];
  for (let i = 0; i < players.length; i++) {
    arr.push(
      ...[
        new MessageButton()
          .setStyle('PRIMARY')
          .setCustomID((players[i] === null ? '' : 'ig_') + 'p' + (i + 1))
          .setLabel(players[i] ? players[i].tag : 'Player ' + (i + 1))
          .setDisabled(!!players[i]),
        i === 0 ? vsButton : undefined,
      ].filter(v => v !== undefined)
    );
  }
  return arr;
}

function getPlayerID(customID: `p${1 | 2}`) {
  return +customID.slice(1) - 1;
}
async function generateBoardFrom(board: Chess.Board) {
  const pieces: string[][] = generatePieceArray(board);
  const generator = new ChessImageGenerator({
    size: 512,
    light: '#f9e9a2',
    dark: '#474747',
    style: 'alpha',
  });
  generator.loadArray(pieces);
  const buffer = await generator.generateBuffer();
  return new MessageEmbed()
    .attachFiles([new MessageAttachment(buffer, 'chess.png')])
    .setImage('attachment://chess.png');
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
