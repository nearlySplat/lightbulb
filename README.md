# lightbulb

The [TypeScript](https://typescriptlang.org) rewrite of [Eureka!](https://voidbots.net/bot/eureka).

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
yarn global add typescript && yarn && tsc && node dist
```

## Contributing

Read the `.eslintrc.yml` file or run `eslint .` to fix code style errors. Then, format the code with [Prettier](https://prettier.io) using the `.prettierrc` file.

Also, try to use [the Conventional Commits stuff thing](https://www.conventionalcommits.org/en/v1.0.0/). Yes, I sometimes don't use it. I still haven't figured out how to rename Git Commits.

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
