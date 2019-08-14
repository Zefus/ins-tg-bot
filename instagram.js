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
    streamHandler(bot, instagram);
  });
}

var streamHandler = ({ telegram }, instagram) => {
  const stream = instagram.stream('users/self/media/recent');

  stream.on('messages', async (messages) => {
    try {
      const lastRecent = messages[0];
      switch (lastRecent.type) {

        case "image":
          const photoUrl = lastRecent.images.standard_resolution.url;
          await telegram.sendPhoto(config.get('tg_user_id'), photoUrl,
          {
            caption: `User ${lastRecent.caption.from.username} posted:\n${lastRecent.caption.text}`,
            disable_notification: true,
          });
          break;

        case "video":
          const videoURL = lastRecent.videos.standard_resolution.url
          await telegram.sendVideo(config.get('tg_user_id'), videoURL,
          {
            caption: `User ${lastRecent.caption.from.username} posted:\n${lastRecent.caption.text}`,
            disable_notification: true,
          });
          break;

          case "carousel":
           const carouselMedia = lastRecent.carousel_media;
           const mediaGroup = [];
           carouselMedia.forEach((m) => {
             switch (m.type) {
              case 'image':
               mediaGroup.push({
                 type: 'photo',
                 media: m.images.standard_resolution.url,
               });
                 break;
              case "video":
               mediaGroup.push({
                 type: 'videos',
                 media: m.videos.standard_resolution.url,
               });
                 break;
              default:
              console.log(m.type);
            }
          });
        mediaGroup[0].caption = `User ${lastRecent.caption.from.username} posted:\n ${lastRecent.caption.text}`;
        await telegram.sendMediaGroup(config.get('tg_user_id'), mediaGroup,
        {
          disable_notification: false,
        });
          break;

        default:
        await telegram.sendMessage(config.get('tg_user_id'), `Ooops somithing wrong!`,
        {
          disable_notification: false,
        });
      }
    } catch (error) {
      console.error(`Switch error: ${error}`);
    }
  });

  stream.on('error', err => {
    console.error(`Stream error: ${err}`);
  });
};
