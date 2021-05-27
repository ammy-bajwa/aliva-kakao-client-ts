import { Link } from "react-router-dom";

const PublicNavItems = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" to="/login">
          Login
        </Link>
      </li>
    </>
  );
};

export default PublicNavItems;
