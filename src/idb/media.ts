import { SHA256 } from "crypto-js";
import { openDB } from "idb";

export const handleSingleMessageImgInIdb = async (message: any) => {
  const workPromise = new Promise(async (resolve, reject) => {
    try {
      // open the db and check if data already exists
      const dbName = SHA256("KakaoUserMedia").toString();
      const storeName = "mediaStore";
      const thumbnailKey = SHA256(message.attachment.thumbnailUrl).toString();
      message.attachment.thumbnailKey = thumbnailKey;
      const urlKey = SHA256(message.attachment.url).toString();
      message.attachment.urlKey = urlKey;
      const myImgDb = await openDB(dbName, 1, {
        async upgrade(myImgDb) {
          myImgDb.createObjectStore(storeName);
        },
      });
      const isThumbnailAlreadyExists = await myImgDb.get(
        storeName,
        thumbnailKey
      );
      const isurlAlreadyExists = await myImgDb.get(storeName, urlKey);
      if (!isThumbnailAlreadyExists) {
        console.log("Img message: ", message);
        await myImgDb.put(
          storeName,
          new Blob([message.attachment.thumbnailUrlBase64], {
            type: message.attachment.mt,
          }),
          thumbnailKey
        );
      }
      if (!isurlAlreadyExists) {
        await myImgDb.put(
          storeName,
          new Blob([message.attachment.urlBase64], {
            type: message.attachment.mt,
          }),
          urlKey
        );
      }
      myImgDb.close();
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
  return await workPromise;
};

export const handleMultipleMessagesImgInIdb = async (message: any) => {
  const myWorkPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256("KakaoUserMedia").toString();
      const storeName = "mediaStore";
      const myImgDb = await openDB(dbName, 1, {
        async upgrade(myImgDb) {
          myImgDb.createObjectStore(storeName);
        },
      });
      message.attachment.thumbnailKeys = [];
      message.attachment.urlKeys = [];
      for (
        let index = 0;
        index < message.attachment.thumbnailUrlsBase64.length;
        index++
      ) {
        const thumbnailKey = SHA256(
          message.attachment.thumbnailUrls[index]
        ).toString();
        message.attachment.thumbnailKeys.push(thumbnailKey);
        console.log(message.attachment.thumbnailKeys);
        const urlKey = SHA256(message.attachment.imageUrls[index]).toString();
        message.attachment.urlKeys.push(urlKey);
        const thumbnailBase64 = message.attachment.thumbnailUrlsBase64[index];
        const imgBase64 = message.attachment.urlsBase64[index];

        const isThumbnailAlreadyExists = await myImgDb.get(
          storeName,
          thumbnailKey
        );
        const isurlAlreadyExists = await myImgDb.get(storeName, urlKey);

        if (!isThumbnailAlreadyExists) {
          await myImgDb.put(
            storeName,
            new Blob([thumbnailBase64], {
              type: message.attachment.mtl[index],
            }),
            thumbnailKey
          );
        }
        if (!isurlAlreadyExists) {
          await myImgDb.put(
            storeName,
            new Blob([imgBase64], {
              type: message.attachment.mtl[index],
            }),
            urlKey
          );
        }
      }
      myImgDb.close();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
  return await myWorkPromise;
};

export const handleVoiceMessageInIdb = async (message: any) => {
  const myWorkPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256("KakaoUserMedia").toString();
      const storeName = "mediaStore";
      const audioKey = SHA256(message.attachment?.url).toString();
      const myImgDb = await openDB(dbName, 1, {
        async upgrade(myImgDb) {
          myImgDb.createObjectStore(storeName);
        },
      });
      const isAudioAlreadyExists = await myImgDb.get(storeName, audioKey);
      if (!isAudioAlreadyExists) {
        console.log("Img message: ", message);
        await myImgDb.put(
          storeName,
          new Blob([message.attachment.audioBase64], {
            type: "audio/mpeg",
          }),
          audioKey
        );
      }
      myImgDb.close();

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
  return await myWorkPromise;
};
