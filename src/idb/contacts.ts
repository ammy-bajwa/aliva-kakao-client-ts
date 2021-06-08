import { SHA256 } from "crypto-js";
import { openDB } from "idb";

export const handleContacts = async (contacts: any, loggedInUserId: number) => {
  const contactsHandlerPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${loggedInUserId}`).toString();
      const storeName = "ContactStore";
      const key = "contacts";
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          db.createObjectStore(storeName);
        },
      });
      await db.put(storeName, contacts, key);
      db.close();
      resolve(true);
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await contactsHandlerPromise;
};
