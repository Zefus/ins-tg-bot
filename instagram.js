const Instagram = require('node-instagram').default;
const config = require('config');

module.exports = (bot) => {
  var instances = config.get('instagram');

  instances.forEach((instance) => {
    const instagram = new Instagram({
      clientId: instance.clientId,
      clientSecret: instance.clientSecret,
      accessToken: instance.accessToken,
    });
    streamHandler(bot);
  });
}

var streamHandler = ({ telegram }) => {
  const stream = instagram.stream('users/self/media/recent');

  stream.on('messages', async (messages) => {
    try {
      switch (messages.type) {

        case 'image':
          const photoUrl = messages.images.standard_resolution.url;
          await telegram.sendPhoto(config.get('tg_user_id'), photoUrl,
          {
            caption: `User ${messages.caption.from.username} posted:\n${messages.caption.text}`,
            disable_notification: true,
          });
          break;

        case 'video':
          const videoURL = messages.videos.standard_resolution.url
          await telegram.sendVideo(config.get('tg_user_id'), videoURL,
          {
            caption: `User ${messages.caption.from.username} posted:\n${messages.caption.text}`,
            disable_notification: true,
          });
          break;

          case 'carousel':
           const carouselMedia = messages.carousel_media;
           const mediaGroup = [];
           carouselMedia.forEach((m) => {
             switch (m.type) {
              case 'image':
               mediaGroup.push({
                 type: 'photo',
                 media: m.images.standard_resolution.url,
               });
                 break;
              case 'video':
               mediaGroup.push({
                 type: 'videos',
                 media: m.videos.standard_resolution.url,
               });
                 break;
              default:
              console.log(m.type);
            }
          });
        mediaGroup[0].caption = `User ${messages.caption.from.username} posted:\n ${messages.caption.text}`;
        await telegram.sendMediaGroup(config.get('tg_user_id'), mediaGroup,
        {
          disable_notification: false,
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
};
