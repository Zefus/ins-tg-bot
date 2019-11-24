const Telegraf = require('telegraf');
const config = require('config');
const instagram = require('./instagram.js');
require('dotenv');

const token = process.env.BOT_TOKEN || config.get('telegram');

const url = process.env.URL || config.get('url');

const port = process.env.PORT || config.get('port');

const bot = new Telegraf(token,
{
  webhookReply: true
});

bot.catch((err) => {
  console.error(err);
});

bot.telegram.setWebhook(`${url}/bot${token}`);
bot.startWebhook(`bot${token}`, null, port);

instagram(bot);
