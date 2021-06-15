import { port } from "../helpers/config";
import { errors } from "../helpers/errorCodes";
import { startLoading, stopLoading } from "../utils/loading";

export const trySendDeviceRegisterApi = async (
  deviceName: string,
  deviceId: string,
  email: string,
  password: string
) => {
  startLoading();
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
  let result: any = await fetch(apiEndPoint, requestOptions);
  result = await result.json();
  stopLoading();
  if (result.error) {
    const errorMessage = result.message;
    alert(errorMessage);
    console.log("result: ", errorMessage);
  } else {
    alert(result.message);
    console.log(result.message);
  }
};

export const trySetDeviceRegisterApi = async (
  code: string,
  email: string,
  password: string
) => {
  const setCodePromise = new Promise(async (resolve, reject) => {
    startLoading();
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
    let result: any = await fetch(apiEndPoint, requestOptions);
    result = await result.json();
    stopLoading();
    if (result.error) {
      let errorMessage = errors[`${result.error}`];
      if (!errorMessage) {
        errorMessage = result.message;
      }
      alert(errorMessage);
      console.log("result: ", result);
      console.log("errorMessage: ", errorMessage);
      reject(errorMessage);
    } else {
      resolve(result.message);
      alert(result.message);
      console.log(result);
    }
  });

  return await setCodePromise;
};
