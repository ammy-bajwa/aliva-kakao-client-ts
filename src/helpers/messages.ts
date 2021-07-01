import { getUserChat } from "../api/chat";
import { getLatestContactLogid } from "../idb/contacts";
import {
  getImgBlobFromIdb,
  handleIncommingMessages,
  lastDbMessageTime,
} from "../idb/messages";
import { store } from "../redux";
import { loadChat, setFocusUser } from "../redux/action/user";
import { readBlobText } from "./file";
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
    const { messages }: any = await getUserChat(
      user.email,
      focusedName,
      lastMessageTimeStamp,
      lastChatLogId,
      logId
    );
    const messagesToSet = [...messages, ...allMessages];
    let imgPromisesChat = messagesToSet.map(async (message: any) => {
      if (message.text === "photo"|| message.text === "사진") {
        const imgBlob = await getImgBlobFromIdb(
          message.attachment.thumbnailKey || ""
        );
        if (imgBlob) {
          const base64 = await readBlobText(imgBlob);
          message.thumbnail = `data:${message.attachment.mt};base64,${base64}`;
          console.log("imgBlob: ", imgBlob);
          console.log("base64: ", message.thumbnail);
        }
      }
      return message;
    });
    imgPromisesChat = await Promise.all(imgPromisesChat);
    dispatch(loadChat(imgPromisesChat));
    await handleIncommingMessages(
      imgPromisesChat,
      loggedInUserId,
      focusedUserId
    );
    scrollToEndMessages();
  } catch (error) {
    console.error(error);
  }
};
