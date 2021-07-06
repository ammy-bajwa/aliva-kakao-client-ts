import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logoutUserNodejs } from "../../../api/user";
import { ReduxStore } from "../../../Interfaces/store";
import { logoutUser } from "../../../redux/action/user";
import { startLoading, stopLoading } from "../../../utils/loading";

const PrivateNavItems = ({ email }: { email: string }) => {
  const ws = useSelector((state: ReduxStore) => state.ws);
  const dispatch = useDispatch();
  const history = useHistory();
  const logOutHandler = async () => {
    startLoading();
    await logoutUserNodejs(email);
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
