import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "../pages/login/login";
import RegisterDevice from "../pages/registerDevice/registerDevice";
import Home from "../pages/home/home";
import Navbar from "../components/navbar/navbar";
import Public from "./public/public";
import Private from "./private/private";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Public path="/login" component={Login} />
          <Private path="/register" component={RegisterDevice} />
          <Private path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Router;
