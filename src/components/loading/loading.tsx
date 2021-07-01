import ReactLoading from "react-loading";

import "./loading.css";

const Loading = () => (
  <div className="loadingContainer">
    <ReactLoading
      className="setMarginLoading"
      type="spin"
      color="white"
      height={"2%"}
      width={"2%"}
    />
    <h1 className="m-3">Loading.....</h1>
    <br />
    <h2 id="loginTryMessage"></h2>
  </div>
);

export default Loading;
