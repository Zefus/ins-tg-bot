const Telegraf = require('telegraf');
const Instagram = require('node-instagram').default;
const config = require('config');
const stream = require('./stream.js');

const bot = new Telegraf(process.env.BOT_TOKEN || config.get('telegram'));

var instances = config.get('instagram');

instances.forEach((instance) => {
  const instagram = new Instagram({
    clientId: instance.clientId,
    clientSecret: instance.clientSecret,
    accessToken: instance.accessToken,
  });
  stream(instagram, bot);
});
