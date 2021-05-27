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
    "http://localhost:3000/device/sendCode",
    requestOptions
  );
  result = await result.json();
  if (result.error) {
    const errorMessage = result.message;
    console.log("result: ", errorMessage);
  } else {
    console.log(result.message);
  }
};

export const trySetDeviceRegisterApi = async (
  code: string,
  email: string,
  password: string
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, email, password }),
  };
  let result: any = await fetch(
    "http://localhost:3000/device/setCode",
    requestOptions
  );
  result = await result.json();
  if (result.error) {
    let errorMessage = errors[`${result.error}`];
    if (!errorMessage) {
      errorMessage = result.message;
    }
    console.log("result: ", result);
    console.log("errorMessage: ", errorMessage);
  } else {
    console.log(result);
  }
};
