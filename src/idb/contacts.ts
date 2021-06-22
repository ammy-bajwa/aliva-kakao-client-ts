import { SHA256 } from "crypto-js";
import { deleteDB, openDB } from "idb";

export const handleContacts = async (contacts: any, email: number) => {
  const contactsHandlerPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${email}`).toString();
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

export const getContactListLogs = async (email: number) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${email}`).toString();
      const storeName = "ContactStore";
      const key = "contacts";
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
        const storedContactList = await db.get(storeName, key);
        let contactList: any = {};
        for (const key in storedContactList) {
          if (Object.prototype.hasOwnProperty.call(storedContactList, key)) {
            const { lastChatLogId } = storedContactList[key];
            contactList[key] = { lastChatLogId };
          }
        }
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

export const updateContactLogid = async (
  email: number,
  sender: string,
  receiver: string,
  newLogId: number
) => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    try {
      const dbName = SHA256(`KAKAOCONTACTS${email}`).toString();
      const storeName = "ContactStore";
      const key = "contacts";
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
        resolve(false);
      } else {
        const storedContactList = await db.get(storeName, key);
        if (storedContactList[sender]) {
          storedContactList[sender].lastChatLogId = newLogId;
        } else {
          storedContactList[receiver].lastChatLogId = newLogId;
        }
        await db.put(storeName, storedContactList, key);
        db.close();
        resolve(true);
      }
    } catch (error) {
      reject(error);
      console.error(error);
    }
  });

  return await myTaskPromise;
};
