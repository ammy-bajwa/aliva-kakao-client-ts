import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
// import { logoutUserNodejs } from "../../../api/user";
import { logoutUser } from "../../../redux/action/user";
import { startLoading, stopLoading } from "../../../utils/loading";

const PrivateNavItems = ({ email }: any) => {
  const ws = useSelector((state: any) => state.ws);
  const dispatch = useDispatch();
  const history = useHistory();
  const logOutHandler = async () => {
    startLoading();
    // const deviceData = localStorage.getItem(email);
    // const tokensInfo = localStorage.getItem("token");
    // if (deviceData && tokensInfo) {
    //   const { deviceId, deviceName } = JSON.parse(deviceData);
    //   const { accessToken, refreshToken } = JSON.parse(tokensInfo);
    //   await logoutUserNodejs(deviceId, deviceName, accessToken, refreshToken);
    // }
    dispatch(logoutUser());
    localStorage.removeItem("token");
    history.push("/login");
    ws.close();
    stopLoading();
  };
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" aria-current="page" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <span className="nav-link active">{email}</span>
      </li>
      <li className="nav-item hoverEffect" onClick={logOutHandler}>
        <span className="nav-link active">Logout</span>
      </li>
    </>
  );
};

export default PrivateNavItems;
