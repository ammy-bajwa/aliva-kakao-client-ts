import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const Private = ({ component: Component, token, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      console.log("token: ", token);
      if (!token) {
        return <Redirect to={{ pathname: "/login" }} />;
      } else {
        return <Component {...props} />;
      }
    }}
  />
);

const mapStateToProps = (state: any) => {
  return {
    token: state.user.accessToken,
  };
};

export default connect(mapStateToProps)(Private);
