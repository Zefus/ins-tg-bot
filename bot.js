const Telegraf = require('telegraf');
const config = require('config');
const instagram = require('./instagram.js');
const telegram = require('./telegram.js');
require('dotenv');

const token = process.env.BOT_TOKEN || config.get('telegram');

const bot = new Telegraf(token,
{
  webhookReply: true
});

bot.catch((err) => {
  console.error(err);
});

bot.telegram.setWebhook(`${config.get('url')}/bot${token}`);
bot.startWebhook(`bot${token}`, null, config.get('port'));

instagram(bot);
