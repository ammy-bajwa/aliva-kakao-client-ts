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
        `KAKAOCHAT${otherUserId}${loggedInUserId}`
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
  const dbName = SHA256(`KAKAOCHAT${otherUserId}${loggedInUserId}`).toString();
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
  const dbName = SHA256(`KAKAOCHAT${otherUserId}${loggedInUserId}`).toString();
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
    const newValue = {
      receiverUserName: newMessage.receiverUserName,
      senderName: newMessage.senderName,
      ...newMessage.message,
    };
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
        `KAKAOCHAT${otherUserId}${loggedInUserId}`
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
        });
        db.close();
        await deleteDB(dbName);
      } else {
        const data = await db.get(storeName, key);
        resolve({
          allMessages: data || [],
          lastMessageTimeStamp: data[data.length - 1].sendAt || 0,
        });
      }
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });
  return await getLastMessagePromise;
};
