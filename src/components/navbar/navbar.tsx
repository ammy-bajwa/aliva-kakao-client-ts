import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PrivateNavItems from "./privateNavItems/privateNavItems";
import PublicNavItems from "./publicNavItems/publicNavItems";

import { tryLoginApi } from "../../api/user";
import { startLoading, stopLoading } from "../../utils/loading";
import { port } from "../../helpers/config";
import { loginUser, newMessage, setWs } from "../../redux/action/user";

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
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { key } = data;
            if (key === "newMesssage") {
              const { text, sender, receiverUser, sendAt } = data;
              const messageObj = { text, sender, receiverUser, sendAt };
              console.log("We have a message: ", messageObj);
              const receiverUserName = Object.keys(receiverUser)[0];
              dispatch(
                newMessage({
                  receiverUserName,
                  message: { text, received: true },
                  senderName: sender.nickname,
                })
              );
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
