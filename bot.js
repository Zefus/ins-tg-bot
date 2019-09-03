const Telegraf = require('telegraf');
const config = require('config');
const instagram = require('./instagram.js');
const telegram = require('./telegram.js');
require('dotenv');

const token = process.env.BOT_TOKEN || config.get('telegram');

const url = process.env.URL || config.get('url');

const bot = new Telegraf(token,
{
  webhookReply: true
});

bot.catch((err) => {
  console.error(err);
});

bot.telegram.setWebhook(`${url}/bot${token}`);
bot.startWebhook(`bot${token}`, null, config.get('port'));

instagram(bot);
