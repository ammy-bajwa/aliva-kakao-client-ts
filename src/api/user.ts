import { errors } from "../helpers/errorCodes";

export const tryLoginApi = async (
  email: string,
  password: string,
  deviceName: string,
  deviceId: string
) => {
  const loginPromise = new Promise(async (resolve, reject) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deviceName, deviceId }),
      };
      let result: any = await fetch(
        "/login",
        // "http://localhost:3000/login",
        requestOptions
      );
      result = await result.json();
      if (result.error) {
        let errorMessage = errors[`${result.error}`];
        if (!errorMessage) {
          errorMessage = result.message;
        }
        console.log("result errorMessage: ", errorMessage);
        reject(errorMessage);
      } else {
        console.log("result: ", result);
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
  return await loginPromise;
};
