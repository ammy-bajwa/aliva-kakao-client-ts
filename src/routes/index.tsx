import { BrowserRouter, Switch } from "react-router-dom";

import Login from "../pages/login/login";
import RegisterDevice from "../pages/registerDevice/registerDevice";
import Home from "../pages/home/home";
import Navbar from "../components/navbar/navbar";
import Public from "./public/public";
import { useSelector } from "react-redux";
import Private from "./private/private";

const Router = () => {
  const loading = useSelector((state: any) => state.loading);
  if (loading) {
    return (
      <div>
        <h1>Loading ..........</h1>
      </div>
    );
  } else {
    return (
      <div>
        <BrowserRouter>
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
};

export default Router;
