import { port } from "../helpers/config";
import { errors } from "../helpers/errorCodes";
import { handleIncommingMessages } from "../idb/messages";
import { store } from "../redux";

export const tryLoginApi = async (
  email: string,
  password: string,
  deviceName: string,
  deviceId: string
) => {
  const loginPromise = new Promise(async (resolve, reject) => {
    try {
      const {
        user: { accessToken },
      } = store.getState();
      console.log("accessToken: ", accessToken);
      if (!accessToken) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            deviceName,
            deviceId,
          }),
        };
        let apiEndPoint = "";
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          // dev code
          apiEndPoint = `http://localhost:${port}/login`;
        } else {
          // production code
          apiEndPoint = "/login";
        }
        let result: any = await fetch(apiEndPoint, requestOptions);
        result = await result.json();
        if (result.error) {
          let errorMessage = errors[`${result.error}`];
          if (!errorMessage) {
            errorMessage = result.message;
          }
          alert(errorMessage);
          console.log("result errorMessage: ", errorMessage);
          reject(errorMessage);
        } else {
          console.log("result: ", result);
          const { messages, loggedInUserId } = result;
          // handleIncommingMessages(messages, loggedInUserId);
          resolve(result);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
  return await loginPromise;
};
