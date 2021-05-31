import { Link, useHistory } from "react-router-dom";
import { v4 as randomId } from "uuid";
import {
  trySendDeviceRegisterApi,
  trySetDeviceRegisterApi,
} from "../../api/device";

const RegisterDevice = () => {
  const history = useHistory();

  const registerFormHandler = async (event: any) => {
    event.preventDefault();
    const emailElem = document.getElementById("userEmail") as HTMLInputElement;
    const email = emailElem.value;
    const passwordElem = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    const password = passwordElem.value;
    const deviceNameElem = document.getElementById(
      "machineName"
    ) as HTMLInputElement;
    const deviceName = deviceNameElem.value;
    let deviceId = randomId();
    deviceId = deviceId.split("-").join("");
    console.log("deviceId: ", deviceId);
    try {
      await trySendDeviceRegisterApi(deviceName, deviceId, email, password);
      localStorage.setItem("deviceName", deviceName);
      localStorage.setItem("deviceId", deviceId);
      console.log("deviceName: ", deviceName);
      console.log("deviceId: ", deviceId);
    } catch (error) {
      console.error(error);
    }
  };

  const registerCodeFormHandler = async (event: any) => {
    event.preventDefault();
    const emailElem = document.getElementById("userEmail") as HTMLInputElement;
    const email = emailElem.value;
    const passwordElem = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    const password = passwordElem.value;
    const registerCodeElem = document.getElementById(
      "registerCode"
    ) as HTMLInputElement;
    const registerCode = registerCodeElem.value;
    try {
      await trySetDeviceRegisterApi(registerCode, email, password);
      history.push("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form className="m-3" onSubmit={registerFormHandler}>
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
            autoComplete="true"
            required
            id="userPassword"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="machineName" className="form-label">
            Enter Device Name To Save
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Office Pc"
            id="machineName"
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-dark m-2">
          Send Code
        </button>
        <Link to="/login">
          <button type="submit" className="btn btn-outline-info">
            Login
          </button>
        </Link>
      </form>
      <form className="m-3" onSubmit={registerCodeFormHandler}>
        <div className="mb-3">
          <label htmlFor="registerCode" className="form-label">
            Enter code
          </label>
          <input
            type="number"
            placeholder="1234"
            className="form-control"
            id="registerCode"
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-dark m-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterDevice;
