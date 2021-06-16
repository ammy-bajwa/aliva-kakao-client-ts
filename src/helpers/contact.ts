import { getChatList } from "../api/contact";
import { handleContacts } from "../idb/contacts";
import { store } from "../redux";
import { setContactList } from "../redux/action/user";

export const handleContactList = async (
  senderName: string,
  receiverUserName: string,
  loggedInUserEmail: string
) => {
  const { user: chatList, loggedInUserId } = await store.getState();
  if (!chatList[senderName] || !chatList[receiverUserName]) {
    const contactList = await getChatList(loggedInUserEmail);
    store.dispatch(setContactList(contactList));
    await handleContacts(chatList, loggedInUserId);
  }
};

export const isInContact = async (name: any) => {
  const isInContactPromise = new Promise(async (resolve, reject) => {
    const { user: chatList } = await store.getState();
    if (!chatList[name]) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
  return await isInContactPromise;
};
