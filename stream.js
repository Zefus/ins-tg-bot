const config = require('config');

module.exports = async (instagram, { telegram }) => {
  const stream = instagram.stream('users/self/media/recent');

  stream.on('messages', messages => {
    try {
      switch (messages.type) {
        case 'image':
        const url = messages.images.standard_resolution.url;
        const text = messages.caption.text;
        const username = messages.caption.from.username;
        await telegram.sendPhoto(config.get('tg_user_id'), url, {
          caption: 'User ${username} posted:\n${username}',
          disable_notification: true,
        });
          break;
        default:
        await telegram.sendMessage(
          config.get('tg_user_id'),
          'Wrong content type ${messages.type}',
          Extra.notifications(false),
        );
      }
    } catch (error) {
      console.error(error);
    }
  });

  stream.on('error', err => {
    console.log(err);
  });
}
