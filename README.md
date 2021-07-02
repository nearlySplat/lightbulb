# lightbulb

A small memebot that is focused on utility and a bit of moderation.

## Self-hosting

Running this code will require TypeScript. To install typescript, run

```bash
# for yarn
yarn global add typescript
# for npm
npm i -g typescript
```

Cool! Now you can use `npm run` or `yarn run` with our `dev` and `watch` commands!

- `dev`

Runs `nodemon dist`. You will need to have compiled the code first.

- `watch`

Runs `tsc` in watch mode. This will compile your code when you save the file.

**TL;DR**:

```bash
npm i -g typescript && npm i && tsc && node dist
```

## Running the bot

You'll need a PostgreSQL database of the name `splat` and username `splat`, password `mabuis1` for this to work uwu.

## Contributing

This projects uses the [Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/) for commits. If you want to generate your commit message interactively, use `npm run commit`. Commit messages are linted befote commit using Git Hooks via Husky.

License headers are applied to every file before commit, if you want your name to be explicitly mentioned contact a maintainer.

Every file is also formatted before commit using Husky, again.

## Legal Stuff

Lightbulb is a Discord Bot made by Splatterxl. You are free to use its code in your bot if you

1. do not claim it is your code, and
1. credit the actual author in a prominent place in your code, e.g. a `NOTICE` file.

```
Copyright (C) 2020 Splatterxl

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
