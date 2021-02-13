# lightbulb
The [TypeScript] rewrite of [Eureka!](https://voidbots.net/bot/eureka).

# Self-hosting
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
