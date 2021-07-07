import { SHA256 } from "crypto-js";

import { deleteDB, openDB } from "idb";
import { MessageType } from "../Interfaces/common";

export const handleIncommingMessages = async (
  messages: MessageType[],
  loggedInUserId: number,
  otherUserId: number
) => {
  const messageHandlerPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(
        `KAKAOCHAT${loggedInUserId}${otherUserId}`
      ).toString();
      const storeName = "MessageStore";
      const key = "messages";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, messages, key);
      db.close();
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await messageHandlerPromise;
};

export const getUserMessages = async (
  loggedInUserId: number,
  otherUserId: number
) => {
  const dbName = SHA256(`KAKAOCHAT${loggedInUserId}${otherUserId}`).toString();
  const storeName = "MessageStore";
  const key = "messages";
  let dbNotExists = false;
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      dbNotExists = true;
    },
  });

  if (dbNotExists) {
    db.close();
    await deleteDB(dbName);
    return;
  } else {
    const data = await db.get(storeName, key);
    db.close();
    return data;
  }
};

export const addNewMessageIdb = async (
  loggedInUserId: number,
  otherUserId: number,
  newMessage: {
    message: MessageType;
    senderName: string;
    receiverUserName: string;
  }
) => {
  const dbName = SHA256(`KAKAOCHAT${loggedInUserId}${otherUserId}`).toString();
  const storeName = "MessageStore";
  const key = "messages";
  let dbNotExists = false;
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      dbNotExists = true;
      db.createObjectStore(storeName);
    },
  });
  const newValue = {
    receiverUserName: newMessage.receiverUserName,
    senderName: newMessage.senderName,
    ...newMessage.message,
  };
  if (dbNotExists) {
    await db.put(storeName, [newValue], key);
    db.close();
    return;
  } else {
    const data = await db.get(storeName, key);
    const value = data.concat([newValue]);
    await db.put(storeName, value, key);
    db.close();
    return data;
  }
};

export const lastDbMessageTime = async (
  loggedInUserId: number,
  otherUserId: number
) => {
  const getLastMessagePromise = new Promise(
    async (
      resolve: (value: {
        allMessages: object[] | [];
        lastMessageTimeStamp: number;
        logId: number;
      }) => void,
      reject
    ) => {
      try {
        const dbName = SHA256(
          `KAKAOCHAT${loggedInUserId}${otherUserId}`
        ).toString();
        const storeName = "MessageStore";
        const key = "messages";
        let dbNotExists = false;
        const db = await openDB(dbName, 1, {
          upgrade(db) {
            dbNotExists = true;
          },
        });
        if (dbNotExists) {
          resolve({
            allMessages: [],
            lastMessageTimeStamp: 0,
            logId: 0,
          });
          db.close();
          await deleteDB(dbName);
        } else {
          const messageKeys = await db.getAllKeys(storeName);
          let allIdbMessages = [];
          for (let index = 0; index < messageKeys.length; index++) {
            const messageKey = messageKeys[index];
            const message = await db.get(storeName, messageKey);
            allIdbMessages.push(message);
          }
          resolve({
            allMessages: allIdbMessages,
            lastMessageTimeStamp:
              allIdbMessages[allIdbMessages.length - 1]?.sendAt || 0,
            logId: allIdbMessages[allIdbMessages.length - 1]?.logId || 0,
          });
        }
      } catch (error) {
        reject(error);
        console.error(error);
      }
    }
  );
  return await getLastMessagePromise;
};

export const updatedLastMessageTimeStamp = async (
  email: string,
  latestTimeStamp: number
) => {
  const updatedTimePromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOTIMESTAMP${email}`).toString();
      const storeName = "time";
      const key = "timeStamp";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, latestTimeStamp, key);
      db.close();
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await updatedTimePromise;
};

export const getLastMessageTimeStamp = async (
  email: string
): Promise<number> => {
  const updatedTimePromise: Promise<number> = new Promise(
    async (resolve: (value: number) => void, reject) => {
      try {
        const dbName = SHA256(`KAKAOTIMESTAMP${email}`).toString();
        const storeName = "time";
        const key = "timeStamp";
        const db = await openDB(dbName, 1, {
          upgrade(db) {
            db.createObjectStore(storeName);
          },
        });
        const timeStamp: number = (await db.get(storeName, key)) || 0;
        db.close();
        resolve(timeStamp);
      } catch (error) {
        reject(error);
        console.error(error);
      }
    }
  );

  return await updatedTimePromise;
};

export const updateUserMessages = async (
  loggedInUserId: number,
  newMessages: any
) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      for (const key in newMessages) {
        if (Object.prototype.hasOwnProperty.call(newMessages, key)) {
          const { intId, messages } = newMessages[key];
          const dbName = SHA256(
            `KAKAOCHAT${loggedInUserId}${intId}`
          ).toString();
          const storeName = "MessageStore";
          const db = await openDB(dbName, 1, {
            upgrade(db) {
              db.createObjectStore(storeName);
            },
          });
          for (let index = 0; index < messages.length; index++) {
            const message = messages[index];
            await db.put(storeName, message, message.logId);
          }
          db.close();
        }
      }
      resolve(true);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  return await myTaskPromise;
};

export const updateMessageLogs = async (
  email: string,
  userName: string,
  userId: number,
  message: {
    message: MessageType;
    receiverUserName: string;
    senderName: string;
  },
  logId: number
) => {
  const updatedTimePromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = `${email}_message_logs`;
      const storeName = "myLogsData";
      const key = logId;
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, message, key);
      db.close();
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await updatedTimePromise;
};

export const getImgBlobFromIdb = async (key: string) => {
  const myWorkingTask = new Promise(
    async (resolve: (value: Blob | undefined) => void, reject) => {
      try {
        const dbName = SHA256("KakaoUserMedia").toString();
        const storeName = "mediaStore";
        const db = await openDB(dbName, 1, {
          upgrade(db) {
            db.createObjectStore(storeName);
          },
        });
        const value = await db.get(storeName, key);
        resolve(value);
        db.close();
      } catch (error) {
        reject(error);
        console.error(error);
      }
    }
  );

  return await myWorkingTask;
};
