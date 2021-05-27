import { Link } from "react-router-dom";
import PrivateNavItems from "./privateNavItems/privateNavItems";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#alivaNavbar"
          aria-controls="alivaNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="alivaNavbar">
          <Link className="navbar-brand" to="/">
            AlivaTech
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <PrivateNavItems />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
