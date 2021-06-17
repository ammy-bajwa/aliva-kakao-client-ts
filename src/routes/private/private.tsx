import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const Private = ({ component: Component, token, loading, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      console.log("token: ", token);
      if (!token && !loading) {
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
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(Private);
