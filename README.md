# lightbulb

A small memebot that is focused on utility and a bit of moderation. I would prefer if you didn't selfhost my bot, and instead invited it using this link: [click me!][inv]. This helps me a lot because it lets me know that people have noticed me.

If you're me, and want to host it, or you're not me and are disrespecting my instructions above (smh), self-hosting instructions are below.

## Self-hosting

Running this code will require [TypeScript], and a whole lot of other stuff you can install by running

```sh
npm install
```

If you just want to run it without compiling, a [Release] just _might_ be published once in a while.

Compiling is pretty easy to be honest. Just install all the dependencies (including the dev ones), while simultaneously knocking out your storage drive, then run `tsc`. The code will then be compiled and it (won't) be ready to go.

You'll then need to fix all the runtime errors (they'll _probably_ be descriptive enough for you to figure them out, hopefully).

I've included a few `.example` files for you to fill out with configuration for the bot, but other files you'll have to create on your own. When you're finished with those, rename them to their original name but without the `.example` suffix.

### Database

You'll need to have a MongoDB database ready for this. Put the URL in the `.env` file under the name `MONGO`.

## Running the bot

You can run the bot in any way you'd normally run a Node.js project, but what I use for production is a little tool called [PM2]. It runs your code in-memory, not in the current terminal, and restarts automatically if the process dies!

## Contributing

This projects uses the [Conventional Commits standard][convcommits] for commits. If you want to generate your commit message interactively, use `npm run commit`. Commit messages are linted befote commit using Git Hooks via Husky.

License headers are applied to every file before commit, if you want your name to be explicitly mentioned contact a maintainer.

Every file is also formatted before commit using Husky, again.

## Legal Stuff

Lightbulb is a Discord Bot made by Splatterxl. You are free to use its code in your bot if you keep the original license in a prominent place in your code, e.g. at the top of the file the code has been copied to or in a NOTICE file. Read the [GNU Affero General Public License][AGPL].

```
Lightbulb: a utility-focused meme bot.

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

<!-- links -->

[inv]: https://discord.com/oauth2/authorize?client_id=808333699879796787&scope=bot+applications.commands
[TypeScript]: https://typescriptlang.org
[Release]: https://github.com/nearlySplat/lightbulb/releases
[PM2]: https://pm2.io
[convcommits]: https://conventionalcommits.org/en/v1.0.0
[AGPL]: https://www.gnu.org/licenses
