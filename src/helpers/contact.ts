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
