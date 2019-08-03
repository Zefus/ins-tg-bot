const Telegraf = require('telegraf');
const config = require('config');
const instagram = require('./instagram.js');
require('dotenv');

const bot = new Telegraf(process.env.BOT_TOKEN || config.get('telegram'));

bot.catch((err) => {
  console.error(err);
});

bot.telegram.setWebhook(`${config.get('url')}/bot${process.env.BOT_TOKEN || config.get('telegram')}`);
bot.startWebhook(`bot${process.env.BOT_TOKEN || config.get('telegram')}`, null, config.get('port'));

telegram(bot);
instagram(bot);
