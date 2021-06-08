import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { tryLoginApi } from "../../api/user";
import { port } from "../../helpers/config";
import { handleContactList } from "../../helpers/contact";
import { scrollToEndMessages } from "../../helpers/scroll";
import { info } from "../../helpers/toast";
import { addNewMessageIdb } from "../../idb/messages";
import { store } from "../../redux";
import {
  loginUser,
  logoutUser,
  newMessage,
  setWs,
} from "../../redux/action/user";
import { startLoading, stopLoading } from "../../utils/loading";

class Login extends React.Component<any> {
  loginFormHandler = async (event: any) => {
    const { history, dispatch }: any = this.props;
    event.preventDefault();
    const emailElem = document.getElementById("userEmail") as HTMLInputElement;
    const email = emailElem.value;

    const passwordElem = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    const password = passwordElem.value;
    const deviceData = localStorage.getItem(email);
    if (!deviceData) {
      alert("Please register device first");
    } else {
      try {
        startLoading();
        const { deviceName, deviceId } = JSON.parse(deviceData);
        const user: any = await tryLoginApi(
          email,
          password,
          deviceName,
          deviceId
        );
        console.log("user: ", user);
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
        socket.onclose = () => {
          alert("Socket is closed");
          dispatch(logoutUser());
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
        console.error(error);
      }
    }
  };
  render() {
    return (
      <>
        <form className="m-3" onSubmit={this.loginFormHandler}>
          <div className="mb-3">
            <label htmlFor="userEmail" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="userEmail"
              required
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="userPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              autoComplete="true"
              required
              id="userPassword"
            />
          </div>
          <button type="submit" className="btn btn-outline-dark m-2">
            Login
          </button>
          <Link to="/register">
            <button type="submit" className="btn btn-outline-info">
              Register Device
            </button>
          </Link>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    chatList: state.user.chatList,
    currentFocus: state.currentFocus,
  };
};
export default connect(mapStateToProps)(withRouter(Login));
