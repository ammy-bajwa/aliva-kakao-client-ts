import { tryLoginApi } from "../api/user";
import { addNewMessageIdb } from "../idb/messages";
import { store } from "../redux";
import { loginUser, newMessage, setWs } from "../redux/action/user";
import { startLoading, stopLoading } from "../utils/loading";
import { port } from "./config";
import { handleContactList } from "./contact";
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
      // const lastMessages = await getLastMessageTime();
      const user: any = await tryLoginApi(
        email,
        password,
        deviceName,
        deviceId
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
            const { text, sender, receiverUser, sendAt, attachment } = data;
            const receiverUserName = Object.keys(receiverUser)[0];
            const senderName = sender.nickname;
            const newMessageObj = {
              receiverUserName,
              message: { attachment, text, received: true, sendAt },
              senderName,
            };
            const { currentFocus } = await store.getState();
            console.log("currentFocus: ", currentFocus);
            await handleContactList(senderName, receiverUserName, email);
            if (
              currentFocus === senderName ||
              currentFocus === receiverUserName
            ) {
              dispatch(newMessage(newMessageObj));
              scrollToEndMessages();
            } else {
              info(`New Message From ${senderName} to ${receiverUserName}`);
            }
            await addNewMessageIdb(
              user.loggedInUserId,
              receiverUser[receiverUserName].userId.low,
              newMessageObj
            );
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
      history.push("/");
      stopLoading();
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
