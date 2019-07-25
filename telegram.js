module.exports = (bot) => {
  bot.command('myid', ({ from, reply }) => {
    console.log(from.id);
    return reply(from.id);
  });
}
