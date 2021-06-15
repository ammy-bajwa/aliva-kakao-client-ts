import { BrowserRouter, Switch } from "react-router-dom";
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
    if (loading) {
      return (
        <>
          <Loading />
        </>
      );
    } else {
      return (
        <div>
          <BrowserRouter>
            <ToastContainer />
            <Navbar />
            <Switch>
              <Public path="/login" component={Login} />
              <Public path="/register" component={RegisterDevice} />
              <Private path="/" component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(MainRouter);
