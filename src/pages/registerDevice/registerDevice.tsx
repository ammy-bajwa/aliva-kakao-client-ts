import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { v4 as randomId } from "uuid";
import {
  trySendDeviceRegisterApi,
  trySetDeviceRegisterApi,
} from "../../api/device";

const RegisterDevice = () => {
  const history = useHistory();

  const [deviceName, setDeviceName] = useState("");
  const [isLoadingSend, setLoadingSend] = useState(false);
  const [isLoadingRegister, setLoadingRegister] = useState(false);

  const registerFormHandler = async (event: any) => {
    event.preventDefault();
    const emailElem = document.getElementById("userEmail") as HTMLInputElement;
    const email = emailElem.value;
    const passwordElem = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    const password = passwordElem.value;
    let deviceId = randomId();
    deviceId = deviceId.split("-").join("");
    console.log("deviceId: ", deviceId);
    try {
      setLoadingSend(true);
      await trySendDeviceRegisterApi(deviceName, deviceId, email, password);
      localStorage.setItem(email, JSON.stringify({ deviceName, deviceId }));
      setLoadingSend(false);
      console.log("deviceName: ", deviceName);
      console.log("deviceId: ", deviceId);
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
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
      setLoadingRegister(true);
      await trySetDeviceRegisterApi(registerCode, email, password);
      setLoadingRegister(false);
      history.push("/login");
    } catch (error) {
      console.error(error);
      setLoadingRegister(false);
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
            type="text"
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
            onInput={(event: any) => setDeviceName(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-light m-2">
          {isLoadingSend ? (
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Send Code"
          )}
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
        <button type="submit" className="btn btn-outline-light m-2">
          {isLoadingRegister ? (
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterDevice;
