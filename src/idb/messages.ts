import { SHA256 } from "crypto-js";

import { deleteDB, openDB } from "idb";

export const handleIncommingMessages = async (
  messages: any,
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
  newMessage: any
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
  const getLastMessagePromise = new Promise(async (resolve, reject) => {
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
        const data = await db.get(storeName, key);
        resolve({
          allMessages: data || [],
          lastMessageTimeStamp: data[data.length - 1].sendAt || 0,
          logId: data[data.length - 1].logId || 0,
        });
      }
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });
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

export const getLastMessageTimeStamp = async (email: string) => {
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
      const timeStamp = (await db.get(storeName, key)) || 0;
      db.close();
      resolve(timeStamp);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

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
          const dbItemKey = "messages";
          let dbNotExists = false;
          const db = await openDB(dbName, 1, {
            upgrade(db) {
              dbNotExists = true;
              db.createObjectStore(storeName);
            },
          });
          if (dbNotExists) {
            await db.put(storeName, messages, dbItemKey);
            db.close();
          } else {
            const data = await db.get(storeName, dbItemKey);
            const value = data.concat(messages);
            await db.put(storeName, value, dbItemKey);
            db.close();
          }
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
  message: any,
  logId: number
) => {
  const updatedTimePromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = `${email}_message_logs`;
      const storeName = "myLogsData";
      const key = `${userName}__${userId}__${logId}`;
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
