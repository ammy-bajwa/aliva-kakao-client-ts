import { tryLoginApi } from "../api/user";
import { getLatestContactLogid, updateContactLogid } from "../idb/contacts";
import {
  addNewMessageIdb,
  getLastMessageTimeStamp,
  updatedLastMessageTimeStamp,
} from "../idb/messages";
import { store } from "../redux";
import { loginUser, newMessage, setSending, setWs } from "../redux/action/user";
import { startLoading, stopLoading } from "../utils/loading";
import { port } from "./config";
import { handleContactList, isInContact, refreshContactList } from "./contact";
import { scrollToEndMessages } from "./scroll";
import { info } from "./toast";

export const loginHandler = async (
  isKeepLogin: any,
  token: any,
  dispatch: any,
  history: any
) => {
  if (isKeepLogin && !token) {
    const { email, password } = JSON.parse(isKeepLogin);
    const deviceData: any = localStorage.getItem(email);
    try {
      startLoading();
      const { deviceName, deviceId } = JSON.parse(deviceData);
      // const contactListLogs = await getContactListLogs(email);
      // console.log("contactListLogs: ", contactListLogs);
      const lastMessageTimeStamp = await getLastMessageTimeStamp(email);
      const latestLogId = await getLatestContactLogid(email);
      const user: any = await tryLoginApi(
        email,
        password,
        deviceName,
        deviceId,
        lastMessageTimeStamp,
        latestLogId
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
            const { text, sender, receiverUser, logId, sendAt, attachment } =
              data;
            console.log("newMesssage: ", data);
            const { nickname: receiverUserName, intId: receiverIntId } =
              receiverUser;
            const { nickname: senderName, intId: senderIntId } = sender;
            const newMessageObj = {
              receiverUserName,
              message: { attachment, text, received: true, sendAt, logId },
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
              await refreshContactList();
            }
            const isInContactExists = await isInContact(senderName);
            if (isInContactExists) {
              await addNewMessageIdb(
                user.loggedInUserId,
                receiverIntId,
                newMessageObj
              );
            } else {
              if (senderIntId === user.loggedInUserId) {
                await addNewMessageIdb(
                  user.loggedInUserId,
                  receiverIntId,
                  newMessageObj
                );
              } else {
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
    } catch (error) {
      stopLoading();
      localStorage.removeItem("token");
      history.push("/login");
      console.error(error);
    }
  } else {
    console.log("Acoided +++++++++++++++++++");
  }
};
