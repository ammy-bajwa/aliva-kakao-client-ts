import { tryLoginApi } from "../api/user";
import { getLatestContactLogid, updateContactLogid } from "../idb/contacts";
import {
  addNewMessageIdb,
  getLastMessageTimeStamp,
  updatedLastMessageTimeStamp,
  updateMessageLogs,
} from "../idb/messages";
import { MessageType } from "../Interfaces/common";
import { store } from "../redux";
import { loginUser, newMessage, setSending, setWs } from "../redux/action/user";
import { startLoading, stopLoading } from "../utils/loading";
import { port } from "./config";
import { handleContactList, isInContact, refreshContactList } from "./contact";
import { scrollToEndMessages } from "./scroll";
import { info } from "./toast";

export const loginHandler = async (
  isKeepLogin: string,
  token: string | undefined | null,
  dispatch: Function,
  history: any
) => {
  const myWorkingPromise = await new Promise(async (resolve, reject) => {
    if (isKeepLogin && !token) {
      const { email, password, accessToken, refreshToken } =
        JSON.parse(isKeepLogin);
      const deviceData: any = localStorage.getItem(email);
      try {
        startLoading();
        const { deviceName, deviceId } = JSON.parse(deviceData);
        // const contactListLogs = await getContactListLogs(email);
        // console.log("contactListLogs: ", contactListLogs);
        const lastMessageTimeStamp: number = await getLastMessageTimeStamp(
          email
        );
        const latestLogId: number = await getLatestContactLogid(email);
        const user: any = await tryLoginApi(
          email,
          password,
          deviceName,
          deviceId,
          lastMessageTimeStamp,
          latestLogId,
          accessToken,
          refreshToken
        );
        let wsEndPoint = "";
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          // dev code
          wsEndPoint = `ws://localhost:${port}`;
        } else {
          // production code
          wsEndPoint = window.location.origin.replace(/^http/, "ws");
        }
        const socket = new WebSocket(wsEndPoint);
        socket.onopen = () => {
          console.log("Socket is open");
          socket.send(JSON.stringify({ key: "setEmail", value: email }));
          dispatch(setWs(socket));
        };
        socket.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            const { key } = data;
            if (key === "newMesssage") {
              const {
                text,
                sender,
                receiverUser,
                logId,
                sendAt,
                attachment,
              }: MessageType = data;
              console.log("newMesssage: ", data);
              const {
                nickname: receiverUserName,
                intId: receiverIntId,
              }: { nickname: string; intId: number } = receiverUser;
              const {
                nickname: senderName,
                intId: senderIntId,
              }: { nickname: string; intId: number } = sender;
              const newMessageObj: any = {
                message: { attachment, text, received: true, sendAt, logId },
                receiverUserName,
                senderName,
              };
              await handleContactList(senderName, receiverUserName, email);
              await updateContactLogid(email, logId);
              const { currentFocus } = await store.getState();
              if (
                currentFocus === senderName ||
                currentFocus === receiverUserName
              ) {
                dispatch(newMessage(newMessageObj));
                dispatch(setSending(false));
                scrollToEndMessages();
              } else {
                info(`New Message From ${senderName} to ${receiverUserName}`);
              }
              await refreshContactList();
              const isInContactExists = await isInContact(senderName);
              if (isInContactExists) {
                await updateMessageLogs(email, newMessageObj, logId);
                await addNewMessageIdb(
                  user.loggedInUserId,
                  receiverIntId,
                  newMessageObj
                );
              } else {
                if (senderIntId === user.loggedInUserId) {
                  await updateMessageLogs(email, newMessageObj, logId);
                  await addNewMessageIdb(
                    user.loggedInUserId,
                    receiverIntId,
                    newMessageObj
                  );
                } else {
                  await updateMessageLogs(email, newMessageObj, logId);
                  await addNewMessageIdb(
                    user.loggedInUserId,
                    senderIntId,
                    newMessageObj
                  );
                }
                await updatedLastMessageTimeStamp(email, sendAt);
              }
            } else if (key === "unreadMessages") {
              const { userId, messageStore } = data.value;
              console.log(userId, messageStore);
            }
          } catch (error) {
            console.log(error);
            stopLoading();
            console.log("We have a message: ", event.data);
          }
        };
        socket.onerror = () => {
          alert("Socket has error");
        };
        socket.onclose = (err) => {
          alert("Socket is closed");
          console.log(err);
          history.push("/login");
        };
        dispatch(loginUser(user));
        localStorage.setItem(
          "token",
          JSON.stringify({
            accessToken: user.accessToken,
            refreshToken: user.accessToken,
            email,
            password,
          })
        );
        stopLoading();
        history.push("/");
        resolve(true);
      } catch (error) {
        stopLoading();
        localStorage.removeItem("token");
        history.push("/login");
        console.error(error);
        reject(true);
      }
    } else {
      console.log("Acoided +++++++++++++++++++");
      resolve(true);
    }
  });
  return await myWorkingPromise;
};
