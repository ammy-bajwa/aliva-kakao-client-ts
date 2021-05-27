import { errors } from "../helpers/errorCodes";

export const tryLoginApi = async (
  email: string,
  password: string,
  deviceName: string,
  deviceId: string
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, deviceName, deviceId }),
  };
  let result: any = await fetch("http://localhost:3000/login", requestOptions);
  result = await result.json();
  if (result.error) {
    let errorMessage = errors[`${result.error}`];
    if (!errorMessage) {
      errorMessage = result.message;
    }
    console.log("result: ", errorMessage);
  }
  //   let result = await fetch("http://localhost:3000/login", requestOptions);
  //   result = await result.json();
  //   console.log("result: ", result);
};
