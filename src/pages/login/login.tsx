import { Link } from "react-router-dom";
import { tryLoginApi } from "../../api/user";

const Login = () => {
  const loginFormHandler = async (event: any) => {
    event.preventDefault();
    const emailElem = document.getElementById("userEmail") as HTMLInputElement;
    const email = emailElem.value;

    const passwordElem = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    const password = passwordElem.value;
    await tryLoginApi(email, password);
  };

  return (
    <form className="m-3" onSubmit={loginFormHandler}>
      <div className="mb-3">
        <label htmlFor="userEmail" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="userEmail"
          required
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="userPassword" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          required
          id="userPassword"
        />
      </div>
      <button type="submit" className="btn btn-outline-dark m-2">
        Login
      </button>
      <Link to="/register">
        <button type="submit" className="btn btn-outline-info">
          Register Device
        </button>
      </Link>
    </form>
  );
};

export default Login;
