import { port } from "../helpers/config";
import { errors } from "../helpers/errorCodes";
import { handleContacts } from "../idb/contacts";
import {
  updatedLastMessageTimeStamp,
  updateUserMessages,
} from "../idb/messages";
import { store } from "../redux";
import { startLoading, stopLoading } from "../utils/loading";

export const tryLoginApi = async (
  email: string,
  password: string,
  deviceName: string,
  deviceId: string,
  lastMessageTimeStamp: any
) => {
  const loginPromise = new Promise(async (resolve, reject) => {
    try {
      const {
        user: { accessToken },
      } = store.getState();
      console.log("accessToken: ", accessToken);
      if (!accessToken) {
        startLoading();
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            deviceName,
            deviceId,
            lastMessageTimeStamp,
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
        stopLoading();
        if (result.error) {
          let errorMessage = errors[`${result.error}`];
          if (!errorMessage) {
            errorMessage = result.message;
          }
          alert(errorMessage);
          console.log("result errorMessage: ", errorMessage);
          reject(errorMessage);
        } else {
          await handleContacts(result.chatList, result.loggedInUserId);
          await updateUserMessages(result.loggedInUserId, result.chatList);
          console.log("result: ", result);
          await updatedLastMessageTimeStamp(
            result.email,
            result.largestTimeStamp
          );
          resolve(result);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
  return await loginPromise;
};
