import { getUserChat } from "../api/chat";
import { getLatestContactLogid } from "../idb/contacts";
import { handleIncommingMessages, lastDbMessageTime } from "../idb/messages";
import { store } from "../redux";
import { loadChat, setFocusUser } from "../redux/action/user";
import { scrollToEndMessages } from "./scroll";

export const refreshMessages = async (focusedName: string) => {
  try {
    const { loggedInUserId, user }: any = await store.getState();
    const { dispatch } = store;
    const lastChatLogId = getLatestContactLogid(user.email);
    const focusedUserId = user.chatList[focusedName]?.intId;
    dispatch(setFocusUser(focusedName));
    const { allMessages, lastMessageTimeStamp, logId }: any =
      await lastDbMessageTime(loggedInUserId, focusedUserId);
    // console.log("Fired");
    // console.log(lastMessageTimeStamp);
    if (lastChatLogId > logId) {
      const { messages }: any = await getUserChat(
        user.email,
        focusedName,
        lastMessageTimeStamp,
        lastChatLogId,
        logId
      );
      dispatch(loadChat([...allMessages, ...messages]));
      await handleIncommingMessages(
        [...allMessages, ...messages],
        loggedInUserId,
        focusedUserId
      );
    } else {
      dispatch(loadChat([...allMessages]));
      await handleIncommingMessages(
        [...allMessages],
        loggedInUserId,
        focusedUserId
      );
    }
    scrollToEndMessages();
  } catch (error) {
    console.error(error);
  }
};
