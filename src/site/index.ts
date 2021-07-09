/* eslint-disable @typescript-eslint/no-explicit-any */
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
import cookie_parser from 'cookie-parser';
import { Permissions, Snowflake, User } from 'discord.js';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { /*config, */ __prod__ } from '../constants.js';
import { APIPartialGuild } from 'discord-api-types';
import { client, commands, loggr } from '../index.js';
import { Achievement, User as UserModel } from '../models/User';
const PORT = __prod__ ? 80 : 8000;
const IP = /* __prod__ ? config.website :*/ 'localhost';
const guildCache = new Map<Snowflake, APIPartialGuild[]>();

const app = express();
const states = new Map<string, Buffer>();
const context = (req: any, user?: User) => ({
  template(name: string, vars: Record<string, unknown> = {}) {
    const str = fs.readFileSync('./templates/' + name + '.ejs', 'utf-8');
    return ejs.render(str, vars);
  },
  client,
  req,
  user,
  commands,
});
const isLoggedIn = (req: any, res: any, next: any) => {
  if (!client.users.cache.get(req.cookies.qid)) {
    return res.redirect('/login?last_page=' + encodeURIComponent(req.path));
  }
  next();
};

app.use(cookie_parser());

app.use((_, res, next) => {
  if (client.user) return next();
  return res.status(503).send('Service Unavailable');
});

app.use(express.static(path.resolve('./assets/site')));

app.use(async (req, res, next) => {
  if (req.cookies.qe <= Date.now()) {
    const search = new URLSearchParams();
    search.set('client_id', client.user.id);
    search.set('client_secret', process.env.CLIENT_SECRET);
    search.set('grant_type', 'refresh_token');
    search.set('refresh_token', req.cookies.qrt);
    const result = await fetch('https://discord.com/api/v9/oauth2/token', {
      body: search.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
    });
    if (!result.ok) {
      // console.log(search, result, await result.json());
      // return res
      //   .status(502)
      //   .send(
      //     'Unknown error while trying to recieve bearer token. Code: ' +
      //     result.status +
      //     ' ' +
      //     result.statusText
      //   );
    } else {
      const json = await result.json();
      res.cookie('qe', Date.now() + json.expires_in);
      res.cookie('qrt', json.refresh_token);
      res.cookie('qt', json.access_token);
    }
  }
  next();
});

app.get('/', (req, res) => {
  return res.render(
    'index.ejs',
    context(req, client.users.cache.get(req.cookies.qid))
  );
});
app.get('/login', (req, res) => {
  if (req.cookies.qt) return res.redirect(<string>req.query.last_page || '/');
  const state = Buffer.from(
    `${Math.random() * Number.MAX_SAFE_INTEGER}${
      Math.random() * Number.MAX_SAFE_INTEGER
    }${client.user.id}`
  );
  states.set(req.ip, state);
  res.cookie('qst', state.toString('base64url'), {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 30),
  });
  res.cookie('qlu', req.query.last_page || '/');
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${
      client.user.id
    }&scope=identify%20guilds&redirect_uri=http%3A%2F%2F${IP}%3A${PORT}%2Fauth&response_type=code&state=${state.toString(
      'base64url'
    )}&prompt=none`
  );
});

app.get('/auth', async (req, res) => {
  res.clearCookie('qst');
  if (
    (<string>req.query.state || '') !==
    states.get(req.ip)?.toString('base64url')
  ) {
    states.delete(req.ip);
    return res.render('invalidState.ejs', { state: <string>req.query.state });
  }
  states.delete(req.ip);
  const search = new URLSearchParams();
  search.set('client_id', client.user.id);
  search.set('client_secret', process.env.CLIENT_SECRET);
  search.set('grant_type', 'authorization_code');
  search.set('code', <string>req.query.code);
  search.set('redirect_uri', `http://${IP}:${PORT}/auth`);
  const result = await fetch('https://discord.com/api/v9/oauth2/token', {
    body: search.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
  });
  if (!result.ok)
    return res
      .status(502)
      .send(
        'Unknown error while trying to recieve bearer token. Code: ' +
          result.status +
          ' ' +
          result.statusText
      );
  const json = await result.json();
  res.cookie('qe', Date.now() + json.expires_in);
  res.cookie('qrt', json.refresh_token);
  res.cookie('qt', json.access_token);
  res.clearCookie('qlu');
  res.clearCookie('qst');
  const user = new User(
    client,
    await fetch('https://discord.com/api/v9/users/@me', {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    }).then(v => v.json())
  );
  res.cookie('qid', user.id);
  client.users.cache.set(user.id, user);
  res.redirect(req.cookies.qlu);
});

app.get('/logout', async (req, res) => {
  if (!req.cookies.qt) return res.status(400).send('No token to revoke');
  guildCache.delete(req.cookies.qid);
  res.clearCookie('qid');
  res.clearCookie('qe');
  res.clearCookie('qrt');
  res.clearCookie('qt');
  return res.redirect('/');
});

app.get('/profile', isLoggedIn, async (req, res) =>
  res.render('profile.ejs', {
    res,
    profile: await UserModel.findOne({ uid: req.cookies.qid }).exec(),
    commands: commands,
    Achievement,
    ...context(req, client.users.cache.get(req.cookies.qid)),
  })
);
app.get('/dashboard/:gid', isLoggedIn, async (req, res) => {
  const guild = client.guilds.cache.get(<Snowflake>req.params.gid);
  if (!guild)
    return res.render(
      'dashboard/404.ejs',
      context(req, client.users.cache.get(req.cookies.qid))
    );
  if (
    !(await guild.members.fetch({ user: req.cookies.qid, cache: true })) ||
    !guild.members.cache
      .get(req.cookies.qid)
      .permissions.has(Permissions.FLAGS.MANAGE_GUILD)
  )
    return res
      .status(403)
      .render(
        'dashboard/unauthorized.ejs',
        context(req, client.users.cache.get(req.cookies.qid))
      );
  return res.render('dashboard/index.ejs', {
    ...context(req, client.users.cache.get(req.cookies.qid)),
    guild,
  });
});

app.get('/dashboard', isLoggedIn, async (req, res) => {
  let json: APIPartialGuild[] =
    guildCache.has(req.cookies.qid) && !req.query.force
      ? guildCache.get(req.cookies.qid)
      : [];
  try {
    if (json.length === 0) {
      const result = await fetch(
        'https://discord.com/api/v9/users/@me/guilds',
        {
          headers: { Authorization: `Bearer ${req.cookies.qt}` },
        }
      );
      if (!result.ok) throw '';
      json = await result.json();
    }
  } catch {
    return res.redirect('/login?last_page=/dashboard');
  }
  guildCache.set(req.cookies.qid, json);
  return res.render('dashboard/home.ejs', {
    guilds: json,
    ...context(req, client.users.cache.get(req.cookies.qid)),
    Permissions,
  });
});
//

//

//

app.use((req, res) =>
  res
    .status(404)
    .render('404.ejs', context(req, client.users.cache.get(req.cookies.qid)))
);

app.listen(PORT, () => loggr.info('Website listening on port', PORT));
