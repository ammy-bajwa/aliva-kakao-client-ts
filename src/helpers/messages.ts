import { SHA256 } from "crypto-js";
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
      if (
        message.text === "photo" ||
        (message.text === "사진" && message.attachment?.thumbnailUrl)
      ) {
        const imgBlob = await getImgBlobFromIdb(
          message.attachment.thumbnailKey || ""
        );
        if (imgBlob) {
          const base64 = await readBlobText(imgBlob);
          message.thumbnail = `data:${message.attachment.mt};base64,${base64}`;
          console.log("imgBlob: ", imgBlob);
          console.log("base64: ", message.thumbnail);
        }
      } else if (message?.attachment?.thumbnailUrls) {
        message.thumbnails = [];
        for (
          let index = 0;
          index < message?.attachment.thumbnailUrls.length;
          index++
        ) {
          const thumbnailUrl = message?.attachment.thumbnailUrls[index];
          const key = SHA256(thumbnailUrl).toString();
          const imgBlob = await getImgBlobFromIdb(key);
          const base64 = await readBlobText(imgBlob);
          message.thumbnails.push(
            `data:${message.attachment.mtl[index]};base64,${base64}`
          );
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
