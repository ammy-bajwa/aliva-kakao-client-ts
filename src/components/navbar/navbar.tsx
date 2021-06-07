import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PrivateNavItems from "./privateNavItems/privateNavItems";
import PublicNavItems from "./publicNavItems/publicNavItems";

import { tryLoginApi } from "../../api/user";
import { startLoading, stopLoading } from "../../utils/loading";
import { port } from "../../helpers/config";
import { loginUser, newMessage, setWs } from "../../redux/action/user";
import { addNewMessageIdb } from "../../idb/messages";
import { store } from "../../redux";
import { scrollToEndMessages } from "../../helpers/scroll";
import { info } from "../../helpers/toast";
// import { getLastMessageTime } from "../../idb/messages";

class Navbar extends React.Component<any> {
  async componentDidMount() {
    const isKeepLogin = localStorage.getItem("token");
    const { dispatch, history, token }: any = this.props;
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

              const newMessageObj = {
                receiverUserName,
                message: { attachment, text, received: true, sendAt },
                senderName: sender.nickname,
              };
              const { currentFocus } = await store.getState();
              console.log("currentFocus: ", currentFocus);
              if (
                currentFocus === sender.nickname ||
                currentFocus === receiverUserName
              ) {
                dispatch(newMessage(newMessageObj));
                scrollToEndMessages();
              } else {
                info(
                  `New Message From ${sender.nickname} to ${receiverUserName}`
                );
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
  }
  render() {
    const { token, email }: any = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#alivaNavbar"
            aria-controls="alivaNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="alivaNavbar">
            <Link className="navbar-brand" to="/">
              AlivaTech
            </Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {token ? <PrivateNavItems email={email} /> : <PublicNavItems />}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    token: state.user.accessToken,
    email: state.user.email,
  };
};

export default connect(mapStateToProps)(withRouter(Navbar));
