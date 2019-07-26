const Telegraf = require('telegraf');
const config = require('config');
const instagram = require('./instagram.js');

const bot = new Telegraf(process.env.BOT_TOKEN || config.get('telegram'));

instagram(bot);
