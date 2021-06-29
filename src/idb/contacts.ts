import { SHA256 } from "crypto-js";
import { deleteDB, openDB } from "idb";

export const handleContacts = async (contacts: any, email: number) => {
  const contactsHandlerPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${email}`).toString();
      const storeName = "ContactStore";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      const messageDb = await openDB(`${email}_message_logs`, 1, {
        upgrade(db) {
          db.createObjectStore("myLogsData");
        },
      });
      for (const key in contacts) {
        if (Object.prototype.hasOwnProperty.call(contacts, key)) {
          const element = contacts[key];
          await db.put(storeName, element, element.intId);
          element.messages.forEach(async (message: any) => {
            const key = `${element.displayUserList[0].nickname}__${element.intId}__${message.logId}`;
            if (
              message?.text === "photo" &&
              message?.attachment &&
              message?.attachment?.thumbnailUrlBase64 &&
              message?.attachment?.urlBase64
            ) {
              // open the db and check if data already exists
              const dbName = SHA256("KakaoUserImages").toString();
              const storeName = "imgStore";
              const thumbnailKey = SHA256(
                message.attachment.thumbnailUrl
              ).toString();
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
            }
            await messageDb.put("myLogsData", message, key);
          });
        }
      }
      db.close();
      setTimeout(() => {
        messageDb.close();
      }, 1000);
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await contactsHandlerPromise;
};

export const getContactListLogs = async (email: number) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${email}`).toString();
      const storeName = "ContactStore";
      let isExists = true;
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
          isExists = false;
        },
      });
      if (!isExists) {
        db.close();
        await deleteDB(dbName);
        resolve([]);
      } else {
        const storeKeys = await db.getAllKeys(storeName);
        let contactList: any = {};
        storeKeys.forEach(async (element) => {
          const { lastChatLogId } = await db.get(storeName, element);
          contactList[lastChatLogId] = { lastChatLogId };
        });
        db.close();
        resolve(contactList);
      }
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await myTaskPromise;
};

export const updateContactLogid = async (email: string, newLogId: number) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOLOGID${email}`).toString();
      const storeName = "logs";
      const key = "logId";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, newLogId, key);
      db.close();
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await myTaskPromise;
};

export const getLatestContactLogid = async (email: any) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOLOGID${email}`).toString();
      const storeName = "logs";
      const key = "logId";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      const value = (await db.get(storeName, key)) || 0;
      db.close();
      resolve(value);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await myTaskPromise;
};
