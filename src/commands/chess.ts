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
import {
  Collection,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageFlags,
  User,
} from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { accessLevels } from '../util';
namespace Chess {
  export type Coordinates = `${'a' | 'b' | 'c' | 'd' | 'e'}${
    | 1
    | 2
    | 3
    | 4
    | 5}`;
  export type Board = Record<Chess.Coordinates, Chess.Square | null>;
  export interface Square {
    piece: Chess.Piece;
    color: Chess.Team;
  }
  export type PieceType = 'N' | 'P' | 'K' | 'R';
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
  ...'abcde',
  ...'abcde',
  ...'abcde',
  ...'abcde',
  ...'abcde',
].map((v, i) => v + '' + (Math.floor(i / 5) + 1)) as Chess.Coordinates[];
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
    piece: { type: 'K', team: 'white' },
    color: 'black',
  },
  d1: {
    piece: { type: 'N', team: 'white' },
    color: 'white',
  },
  e1: { piece: { type: 'R', team: 'white' }, color: 'black' },
  ...Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [
      coords[i + 5],
      { piece: { type: 'P', team: 'white' }, color: i % 2 ? 'black' : 'white' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [
      coords[i + 10],
      { piece: null, color: i % 2 ? 'white' : 'black' },
    ])
  ),
  ...Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [
      coords[i + 15],
      { piece: { type: 'P', team: 'black' }, color: i % 2 ? 'black' : 'white' },
    ])
  ),
  a5: {
    piece: { type: 'R', team: 'black' },
    color: 'black',
  },
  b5: {
    piece: {
      type: 'N',
      team: 'black',
    },
    color: 'white',
  },
  c5: {
    piece: { type: 'K', team: 'black' },
    color: 'black',
  },
  d5: {
    piece: { type: 'N', team: 'black' },
    color: 'white',
  },
  e5: { piece: { type: 'R', team: 'black' }, color: 'black' },
} as Chess.Board;
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
        if (players[pid] || players.includes(ctx.user))
          return {
            type: 4,
            data: { content: "You can't do that!", flags: 64 },
          };
        players[pid] = ctx.user;
        if (players.filter(v => v).length === 2) {
          await ctx.message.edit(
            `__**${players[0].tag}**__ v. **${players[1].tag}** (underlined user is to move)`,
            { components: generateBoardFrom(board) }
          );
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
          .setLabel(players[i] ? players[i].tag : 'Player ' + (i + 1)),
        i === 0 ? vsButton : undefined,
      ].filter(v => v !== undefined)
    );
  }
  return arr;
}

function getPlayerID(customID: `p${1 | 2}`) {
  return +customID.slice(1) - 1;
}
const squareStyles: Record<string, MessageButtonStyleResolvable> = {
  white: 'PRIMARY',
  black: 'SECONDARY',
};
function generateBoardFrom(board: Chess.Board) {
  const coll = new Collection<string, MessageButton[]>();
  for (const pos of Object.keys(board)) {
    if (!coll.has(pos.slice(1))) {
      coll.set(pos.slice(1), []);
    }
  }
  for (const [pos, square] of Object.entries(board)) {
    if (!square.piece) {
      const arr = coll.get(pos.slice(1));
      arr.push(
        new MessageButton()
          .setStyle(squareStyles[square.color])
          .setCustomID(pos)
          .setLabel('\u200b')
      );
    } else {
      const arr = coll.get(pos.slice(1));
      arr.push(
        new MessageButton()
          .setStyle(squareStyles[square.color])
          .setLabel(square.piece.type + pos)
          .setCustomID(pos)
      );
      coll.set(pos.slice(1), arr);
    }
  }
  const toReturn = coll.map(V => new MessageActionRow({ components: V }));
  return toReturn.reverse();
}
