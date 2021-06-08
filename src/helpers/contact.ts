import { getChatList } from "../api/contact";
import { store } from "../redux";
import { setContactList } from "../redux/action/user";

export const handleContactList = async (
  senderName: string,
  receiverUserName: string,
  loggedInUserEmail: string
) => {
  const { user: chatList } = await store.getState();
  if (!chatList[senderName] || !chatList[receiverUserName]) {
    const contactList = await getChatList(loggedInUserEmail);
    store.dispatch(setContactList(contactList));
  }
};
