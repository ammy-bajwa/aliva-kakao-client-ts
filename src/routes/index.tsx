import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "../pages/login/login";
import RegisterDevice from "../pages/registerDevice/registerDevice";
import Home from "../pages/home/home";
import Navbar from "../components/navbar/navbar";
import Public from "./public/public";
import { connect } from "react-redux";
import Private from "./private/private";
import React from "react";
import Loading from "../components/loading/loading";

class MainRouter extends React.Component {
  render() {
    const { loading }: any = this.props;
    return (
      <>
        <BrowserRouter>
          <ToastContainer />
          <Navbar />
          {loading ? (
            <Loading />
          ) : (
            <>
              <Private exact path="/" component={Home} />
              <Public exact path="/login" component={Login} />
              <Public exact path="/register" component={RegisterDevice} />
            </>
          )}
        </BrowserRouter>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(MainRouter);
