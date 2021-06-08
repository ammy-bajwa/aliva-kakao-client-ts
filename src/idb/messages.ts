import { SHA256 } from "crypto-js";

import { deleteDB, openDB } from "idb";

export const handleIncommingMessages = async (
  messages: any,
  loggedInUserId: number,
  otherUserId: number
) => {
  const dbName = SHA256(`KAKAOCHAT${otherUserId}${loggedInUserId}`).toString();
  const storeName = "MessageStore";
  const key = "messages";
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });
  await db.put(storeName, messages, key);
  db.close();
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
    await deleteDB(dbName);
    return;
  } else {
    const data = await db.get(storeName, key);
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
    return data;
  }
};
