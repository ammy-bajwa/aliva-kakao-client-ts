import { port } from "../helpers/config";
import { errors } from "../helpers/errorCodes";
import { resultType } from "../Interfaces/chat";

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
  let result: any = await fetch(apiEndPoint, requestOptions);
  result = await result.json();
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
    let result: resultType = await fetch(apiEndPoint, requestOptions);
    interface newResultType {
    error : string | undefined,
    message : string | undefined
          
    }

    let newResult = await result.json();
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
      console.log(result);
    }
  });

  return await setCodePromise;
};
