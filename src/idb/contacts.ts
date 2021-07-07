import { SHA256 } from "crypto-js";
import { deleteDB, openDB } from "idb";
import {
  handleMultipleMessagesImgInIdb,
  handleSingleMessageImgInIdb,
  handleVoiceMessageInIdb,
} from "./media";

export const handleContacts = async (contacts: any, email: string) => {
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
            const key = `${message.logId}`;
            if (
              (message?.text === "photo" || message?.text === "사진") &&
              message?.attachment &&
              message?.attachment?.thumbnailUrlBase64 &&
              message?.attachment?.urlBase64
            ) {
              await handleSingleMessageImgInIdb(message);
            } else if (
              message.attachment?.thumbnailUrlsBase64 &&
              message.attachment?.urlsBase64
            ) {
              await handleMultipleMessagesImgInIdb(message);
            } else if (
              message.text === "voice note" &&
              message.attachment?.url
            ) {
              await handleVoiceMessageInIdb(message);
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

export const getLatestContactLogid = async (email: string): Promise<number> => {
  const myTaskPromise = new Promise(
    async (resolve: (value: number) => void, reject) => {
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
    }
  );

  return await myTaskPromise;
};
