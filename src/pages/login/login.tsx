import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loginHandler } from "../../helpers/loginHandler";

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
        await loginHandler(
          JSON.stringify({ email, password }),
          null,
          dispatch,
          history
        );
        history.push("/");
      } catch (error) {
        console.error(error);
        history.push("/login");
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
          <button type="submit" className="btn btn-outline-light m-2">
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
