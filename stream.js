const config = require('config');

module.exports = async (instagram, { telegram }) => {
  const stream = instagram.stream('users/self/media/recent');

  stream.on('messages', messages => {
    try {
      switch (messages.type) {
        case 'image':
        case 'image':
          const photoUrl = messages.images.standard_resolution.url;
          await telegram.sendPhoto(config.get('tg_user_id'), photoUrl,
          {
            caption: `User ${messages.caption.from.username} posted:\n${messages.caption.text}`,
            disable_notification: true,
          });
          break;
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
