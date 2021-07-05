import { port } from "../helpers/config";
import { errors } from "../helpers/errorCodes";
import { FetchType } from "../Interfaces/common";
import { deviceCodeResponseType } from "../Interfaces/device";

export const trySendDeviceRegisterApi = async (
  deviceName: string,
  deviceId: string,
  email: string,
  password: string
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceName, deviceId, email, password }),
  };
  let apiEndPoint = "";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    apiEndPoint = `http://localhost:${port}/device/sendCode`;
  } else {
    // production code
    apiEndPoint = "/device/sendCode";
  }
  let result: FetchType = await fetch(apiEndPoint, requestOptions);
  let resultJson: deviceCodeResponseType = await result.json();
  if (resultJson.error) {
    const errorMessage = resultJson.message;
    alert(errorMessage);
    console.log("result: ", errorMessage);
  } else {
    alert(resultJson.message);
    console.log(resultJson.message);
  }
};

export const trySetDeviceRegisterApi = async (
  code: string,
  email: string,
  password: string
) => {
  const setCodePromise = new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, email, password }),
    };
    let apiEndPoint = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // dev code
      apiEndPoint = `http://localhost:${port}/device/setCode`;
    } else {
      // production code
      apiEndPoint = "/device/setCode";
    }
    let result: FetchType = await fetch(apiEndPoint, requestOptions);

    let newResult: deviceCodeResponseType = await result.json();

    if (newResult.error) {
      let errorMessage = errors[`${newResult.error}`];
      if (!errorMessage) {
        errorMessage = newResult.message;
      }
      alert(errorMessage);
      console.log("result: ", newResult);
      console.log("errorMessage: ", errorMessage);
      reject(errorMessage);
    } else {
      resolve(newResult.message);
      alert(newResult.message);
    }
  });

  return await setCodePromise;
};
