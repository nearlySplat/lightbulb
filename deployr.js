const child_process = require('child_process');
const app = require('express')();
const conf = require('./deployrconf.json');
const { WebhookClient } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

app.listen(8085);

app.post('/', async (req, res) => {
  if (req.header('user-agent') !== conf.auth)
    return res.status(403).send('unauthorized');
  try {
    child_process.execSync('cd ~/lightbulb && git pull');
    child_process.exec(
      'cd ~/lightbulb && tsc && pm2 restart all',
      (e, o, er) => {
        console.log(inspect(e), inspect(o), inspect(er));
      }
    );
    const client = new WebhookClient(conf.webhook.id, conf.webhook.token);
    await client.send({
      embeds: [
        new MessageEmbed()
          .setDescription(
            'deployed on commit' +
              child_process.execSync("git log -n 1 --format='%H'")
          )
          .setColor('YELLOW'),
      ],
      username: 'Lightbulb',
      avatarURL: conf.webhook.avatar,
    });
    return res.status(200).send('success');
  } catch (e) {
    return res.status(500).send(inspect(e));
  }
});
