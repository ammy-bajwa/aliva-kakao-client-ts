import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import PrivateNavItems from "./privateNavItems/privateNavItems";
import PublicNavItems from "./publicNavItems/publicNavItems";

import { loginHandler } from "../../helpers/loginHandler";

class Navbar extends React.Component<any> {
  async componentDidMount() {
    const isKeepLogin = localStorage.getItem("token");
    const { dispatch, history, token }: any = this.props;
    try {
      await loginHandler(isKeepLogin, token, dispatch, history);
    } catch (error) {}
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
