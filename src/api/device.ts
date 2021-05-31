import { errors } from "../helpers/errorCodes";

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
  let result: any = await fetch(
    "/device/sendCode",
    // "http://localhost:3000/device/sendCode",
    requestOptions
  );
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
    let result: any = await fetch(
      "/device/setCode",
      // "http://localhost:3000/device/setCode",
      requestOptions
    );
    result = await result.json();
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
      console.log(result);
    }
  });

  return await setCodePromise;
};
