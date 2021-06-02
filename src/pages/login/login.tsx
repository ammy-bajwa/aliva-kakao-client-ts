import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { tryLoginApi } from "../../api/user";
import { port } from "../../helpers/config";
import {
  loginUser,
  logoutUser,
  newMessage,
  setWs,
} from "../../redux/action/user";
import { startLoading, stopLoading } from "../../utils/loading";

const Login = (props: any) => {
  let history = useHistory();
  const loginFormHandler = async (event: any) => {
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
          props.dispatch(setWs(socket));
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
              props.dispatch(
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
        socket.onclose = () => {
          alert("Socket is closed");
          props.dispatch(logoutUser());
          history.push("/login");
        };
        props.dispatch(loginUser(user));
        localStorage.setItem(
          `${email}_token`,
          JSON.stringify({
            accessToken: user.accessToken,
            refreshToken: user.accessToken,
          })
        );
        history.push("/");
        stopLoading();
      } catch (error) {
        stopLoading();
        console.error(error);
      }
    }
  };

  return (
    <form className="m-3" onSubmit={loginFormHandler}>
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
  );
};

const mapStateToProps = (state: any) => {
  return {
    chatList: state.user.chatList,
  };
};
export default connect(mapStateToProps)(Login);
