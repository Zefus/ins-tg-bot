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
      const tg_user_id = process.env.TG_USER_ID || config.get('tg_user_id');
      const lastRecent = messages[0];
      switch (lastRecent.type) {

        case "image":
          try {
            const photoUrl = lastRecent.images.standard_resolution.url;
            await telegram.sendPhoto(tg_user_id, photoUrl,
            {
              caption: `User ${lastRecent.caption.from.username} posted:\n${lastRecent.caption.text}`,
              disable_notification: true,
            });
          } catch (error) {
            throw new Error(`Image case error: ${error.message}`);
          }
          break;

        case "video":
          try {
            const videoURL = lastRecent.videos.standard_resolution.url
            await telegram.sendVideo(tg_user_id, videoURL,
            {
              caption: `User ${lastRecent.caption.from.username} posted:\n${lastRecent.caption.text}`,
              disable_notification: true,
            });
          } catch (error) {
            throw new Error(`Video case error: ${error.message}`);
          }
          break;

          case "carousel":
          try {
            const carouselMedia = lastRecent.carousel_media;
            const mediaGroup = [];
            carouselMedia.forEach((m) => {
              switch (m.type) {
               case "image":
               try {
                 mediaGroup.push({
                   type: 'photo',
                   media: m.images.standard_resolution.url,
                 });
               } catch (error) {
                 throw new Error(`Image case error: ${error.message}`);
               }
                break;

               case "video":
               try {
                 mediaGroup.push({
                   type: 'video',
                   media: m.videos.standard_resolution.url,
                 });
               } catch (error) {
                 throw new Error(`Video case error: ${error.message}`);
               }
                break;

               default:
               console.log(m.type);
             }
           });
         console.log(mediaGroup);
         mediaGroup[0].caption = `User ${lastRecent.caption.from.username} posted:\n ${lastRecent.caption.text}`;
         await telegram.sendMediaGroup(tg_user_id, mediaGroup,
         {
           disable_notification: false,
         });
          } catch (error) {
            throw new Error(`Carousel case error: ${error.message}`);
          }
          break;

        default:
        await telegram.sendMessage(tg_user_id, `Ooops somithing wrong!`,
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
