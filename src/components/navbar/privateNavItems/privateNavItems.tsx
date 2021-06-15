import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logoutUser } from "../../../redux/action/user";

const PrivateNavItems = ({ email }: any) => {
  const ws = useSelector((state: any) => state.ws);
  const dispatch = useDispatch();
  const history = useHistory();
  const logOutHandler = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    history.push("/login");
    ws.close();
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
