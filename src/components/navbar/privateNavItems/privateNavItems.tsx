import { Link } from "react-router-dom";

const PrivateNavItems = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" aria-current="page" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/">
          Messages
        </Link>
      </li>
      <li className="nav-item">
        <span className="nav-link active">Logout</span>
      </li>
    </>
  );
};

export default PrivateNavItems;
