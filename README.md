# lightbulb
The [TypeScript](https://typescriptlang.org) rewrite of [Eureka!](https://voidbots.net/bot/eureka).

I spend a hecking [![time tracker](https://wakatime.com/badge/github/nearlySplat/lightbulb.svg)](https://wakatime.com/badge/github/nearlySplat/lightbulb) on this thing.

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
