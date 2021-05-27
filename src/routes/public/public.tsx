import { Route } from "react-router";

const Public = ({ component: Component, token, ...rest }: any) => (
  <Route
    {...rest}
    render={(props: any) => {
      return <Component {...props} />;
    }}
  />
);
export default Public;
