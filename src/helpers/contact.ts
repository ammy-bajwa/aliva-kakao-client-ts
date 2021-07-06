import { getChatList } from "../api/contact";
import { handleContacts } from "../idb/contacts";
import { store } from "../redux";
import { setContactList } from "../redux/action/user";

export const handleContactList = async (
  senderName: string,
  receiverUserName: string,
  loggedInUserEmail: string
) => {
  const {
    user: { chatList, email },
  }: { user: { chatList: any; email: string } } = await store.getState();
  if (!chatList[senderName] && !chatList[receiverUserName]) {
    const contactList: object[] | undefined = await getChatList(
      loggedInUserEmail
    );
    store.dispatch(setContactList(contactList));
    await handleContacts(chatList, email);
  }
};

export const isInContact = async (name: string) => {
  const isInContactPromise = new Promise(async (resolve, reject) => {
    const {
      user: { chatList },
    }: { user: { chatList: any } } = store.getState();
    if (!chatList[name]) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
  return await isInContactPromise;
};

export const refreshContactList = async () => {
  const {
    user: { email },
  } = await store.getState();
  const contactList = await getChatList(email);
  store.dispatch(setContactList(contactList));
  await handleContacts(contactList, email);
};
