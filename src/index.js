var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import CatLoggr from 'cat-loggr/ts';
import { Client } from 'discord.js';
import { config } from 'dotenv';
import { join } from 'path';
import { INTENTS } from './constants';
import { loadFiles } from './util';
import { guilds as guildConfig } from './modules/config.json';
export var loggr = new CatLoggr();
export var commands = loadFiles('../commands');
export var slashCommands = loadFiles('../commands/slash');
export var startedTimestamp = Date.now();
export var startedAt = new Date();
var client = new Client({
  allowedMentions: { users: [], roles: [], parse: [], repliedUser: false },
  presence: {
    status: 'idle',
    activity: {
      name: 'moderation events',
      type: 'WATCHING',
    },
  },
  intents: INTENTS,
  partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'],
});
config({
  path: join(__dirname, '..', '.env'),
});
loggr.debug('Loading events...');
var _loop_1 = function (event_1, execute) {
  client.on(event_1, function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return execute.apply(void 0, __spreadArrays([client], params));
  });
  loggr.debug('Loaded event ' + event_1);
};
// normal events
for (var _i = 0, _a = loadFiles('../events'); _i < _a.length; _i++) {
  var _b = _a[_i],
    event_1 = _b[0],
    execute = _b[1].execute;
  _loop_1(event_1, execute);
}
var _loop_2 = function (event_2, execute) {
  client.ws.on(event_2, function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }
    return execute.apply(void 0, __spreadArrays([client], params));
  });
  loggr.debug('Loaded WebSocket event ' + event_2);
};
// websocket events
for (var _c = 0, _d = loadFiles('../events/ws'); _c < _d.length; _c++) {
  var _e = _d[_c],
    event_2 = _e[0],
    execute = _e[1].execute;
  _loop_2(event_2, execute);
}
for (var _f = 0, _g = loadFiles('../modules'); _f < _g.length; _f++) {
  var _h = _g[_f],
    modules = _h[1];
  var _loop_3 = function (name_1, value) {
    console.log(name_1, value);
    client[value.emitter](value.eventName, function () {
      var _a, _b;
      var params = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
      }
      // @ts-ignore
      if (
        value.restricted &&
        !(
          eval(value.guildablePath) in guildConfig ||
          ((_a = guildConfig[eval(value.guildablePath)]) === null ||
          _a === void 0
            ? void 0
            : _a.enabledModules.includes('reaction.selfStarShaming')) ||
          ((_b = guildConfig[eval(value.guildablePath)]) === null ||
          _b === void 0
            ? void 0
            : _b.enabledModules.includes('reaction.*'))
        )
      )
        return;
      value.execute.apply(value, __spreadArrays([client], params));
    });
    console.log('Loaded module ' + name_1);
  };
  for (var _j = 0, _k = Object.entries(modules); _j < _k.length; _j++) {
    var _l = _k[_j],
      name_1 = _l[0],
      value = _l[1];
    _loop_3(name_1, value);
  }
}
// emit reactions for uncached messages
client.on('raw', function (packet) {
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
    return;
  // Grab the channel to check the message from
  var channel = client.channels.cache.get(packet.d.channel_id);
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.cache.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel.messages.fetch(packet.d.message_id).then(function (message) {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    var emoji = packet.d.emoji.id
      ? packet.d.emoji.name + ':' + packet.d.emoji.id
      : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    var reaction = message.reactions.resolve(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction)
      reaction.users.cache.set(
        packet.d.user_id,
        client.users.cache.get(packet.d.user_id)
      );
    // Check which type of event it is before emitting
    if (packet.t === 'MESSAGE_REACTION_ADD') {
      client.emit(
        'messageReactionAdd',
        reaction,
        client.users.cache.get(packet.d.user_id)
      );
    } else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      client.emit(
        'messageReactionRemove',
        reaction,
        client.users.cache.get(packet.d.user_id)
      );
    }
  });
});
client.login(process.env.TOKEN);
