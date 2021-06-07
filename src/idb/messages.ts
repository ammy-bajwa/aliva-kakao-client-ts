import { SHA256 } from "crypto-js";

import { openDB } from "idb";

export const handleIncommingMessages = async (
  messages: any,
  loggedInUserId: number
) => {
  for (const user in messages) {
    if (Object.prototype.hasOwnProperty.call(messages, user)) {
      const { userId, messages: chatMessages } = messages[user];
      const dbName = SHA256(`KAKAOCHAT${userId}${loggedInUserId}`).toString();
      const storeName = "MessageStore";
      const key = "messages";
      console.log(dbName);
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, chatMessages, key);
      db.close();
    }
  }
};
