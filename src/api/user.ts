import { port } from "../helpers/config";
import { causeDelay } from "../helpers/delay";
import { errors } from "../helpers/errorCodes";
import { setLoginLoadingMessage } from "../helpers/loading";
import { handleContacts, updateContactLogid } from "../idb/contacts";
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
  lastMessageTimeStamp: any,
  latestLogId: any,
  myAccessToken: string = "",
  myRefreshToken: string = ""
) => {
  const loginPromise = new Promise(async (resolve, reject) => {
    try {
      const {
        user: { accessToken },
      } = store.getState();
      console.log("accessToken: ", accessToken);
      let loginResult, loginErrorMessage;
      if (!accessToken) {
        startLoading();
        for (let index = 0; index < 15; index++) {
          setLoginLoadingMessage(`Try No ${index + 1}`);
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              deviceName,
              deviceId,
              lastMessageTimeStamp,
              latestLogId,
              accessToken: myAccessToken,
              refreshToken: myRefreshToken,
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
            loginErrorMessage = errorMessage;
            console.log("result errorMessage: ", errorMessage);
            await causeDelay(5000);
            continue;
          } else {
            loginResult = result;
            await handleContacts(result.chatList, result.email);
            await updateUserMessages(result.loggedInUserId, result.chatList);
            await updateContactLogid(email, result.biggestChatLog);
            console.log("result: ", result);
            await updatedLastMessageTimeStamp(
              result.email,
              result.largestTimeStamp
            );
            break;
          }
        }
      }
      stopLoading();
      if (loginResult) {
        resolve(loginResult);
      } else {
        alert(loginErrorMessage);
        reject(loginErrorMessage);
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  return await loginPromise;
};

// export const logoutUserNodejs = async (
//   deviceId: string,
//   deviceName: string,
//   accessToken: string,
//   refreshToken: string
// ) => {
//   const myWorkingPromise = new Promise(async (resolve, reject) => {
//     try {
//       const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           accessToken,
//           refreshToken,
//           deviceId,
//           deviceName,
//         }),
//       };
//       let apiEndPoint = "";
//       if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
//         // dev code
//         apiEndPoint = `http://localhost:${port}/login/logout`;
//       } else {
//         // production code
//         apiEndPoint = "/login/logout";
//       }
//       let result: any = await fetch(apiEndPoint, requestOptions);
//       resolve(true);
//     } catch (error) {
//       reject(error);
//     }
//   });
//   return await myWorkingPromise;
// };
