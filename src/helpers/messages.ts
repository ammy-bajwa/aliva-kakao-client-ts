import { SHA256 } from "crypto-js";
import { getUserChat } from "../api/chat";
import { getLatestContactLogid } from "../idb/contacts";
import {
  getImgBlobFromIdb,
  handleIncommingMessages,
  lastDbMessageTime,
} from "../idb/messages";
import { MessageType } from "../Interfaces/common";
import { store } from "../redux";
import { loadChat, setFocusUser } from "../redux/action/user";
import { readBlobText } from "./file";
import { scrollToEndMessages } from "./scroll";

export const refreshMessages = async (focusedName: string) => {
  try {
    const { loggedInUserId, user }: any = await store.getState();
    const { dispatch } = store;
    const lastChatLogId: number = await getLatestContactLogid(user.email);
    const focusedUserId: number = user.chatList[focusedName]?.intId as number;
    dispatch(setFocusUser(focusedName));
    const {
      allMessages,
      lastMessageTimeStamp,
      logId,
    }: {
      allMessages: object[] | [];
      lastMessageTimeStamp: number;
      logId: number;
    } = await lastDbMessageTime(loggedInUserId, focusedUserId);
    const { messages }: any = await getUserChat(
      user.email,
      focusedName,
      lastMessageTimeStamp,
      lastChatLogId,
      logId
    );
    const messagesToSet = [...messages, ...allMessages];
    const imgPromisesChat: Promise<MessageType>[] = messagesToSet.map(
      async (message: MessageType) => {
        if (
          message.text === "photo" ||
          (message.text === "사진" && message.attachment?.thumbnailUrl)
        ) {
          const imgBlob: Blob | undefined = await getImgBlobFromIdb(
            message.attachment.thumbnailKey || ""
          );
          if (imgBlob) {
            const base64 = await readBlobText(imgBlob);
            message.thumbnail = `data:${message.attachment.mt};base64,${base64}`;
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
            if (imgBlob) {
              const base64 = await readBlobText(imgBlob);
              if (message.attachment.mtl) {
                message.thumbnails.push(
                  `data:${message.attachment.mtl[index]};base64,${base64}`
                );
              }
            }
          }
        } else if (message.text === "voice note" && message.attachment?.url) {
          const key = SHA256(message.attachment?.url).toString();
          const mediaBlob = await getImgBlobFromIdb(key);
          if (mediaBlob) {
            const base64 = await readBlobText(mediaBlob);
            message.audio = `data:audio/mpeg;base64,${base64}`;
          }
        }
        return message;
      }
    );
    const imgPromisesResolvedChat: MessageType[] = await Promise.all(
      imgPromisesChat
    );
    dispatch(loadChat(imgPromisesResolvedChat));
    await handleIncommingMessages(
      imgPromisesResolvedChat,
      loggedInUserId,
      focusedUserId
    );
    scrollToEndMessages();
  } catch (error) {
    console.error(error);
  }
};
