import { port } from "../helpers/config";
import { causeDelay } from "../helpers/delay";
import { errors } from "../helpers/errorCodes";
import { setLoginLoadingMessage } from "../helpers/loading";
import { handleContacts, updateContactLogid } from "../idb/contacts";
import { updateUserMessages } from "../idb/messages";
import { store } from "../redux";
import { startLoading, stopLoading } from "../utils/loading";
import { LoginFetchType, resultIn } from "../Interfaces/api";

export const tryLoginApi = async (
  email: string,
  password: string,
  deviceName: string,
  deviceId: string,
  lastMessageTimeStamp: number,
  latestLogId: number,
  myAccessToken: string = "",
  myRefreshToken: string = ""
) => {
  const loginPromise = new Promise(async (resolve, reject) => {
    try {
      const {
        user: { accessToken },
      } = store.getState();
      console.log("accessToken: ", accessToken);
      let loginResult: resultIn | undefined | null;
      let loginErrorMessage: string = "";
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
          const result: LoginFetchType = await fetch(
            apiEndPoint,
            requestOptions
          );
          console.log(typeof result);
          const resultJson: resultIn = await result.json();

          if (resultJson.error) {
            let errorMessage = errors[`${resultJson.error}`];
            if (!errorMessage) {
              errorMessage = resultJson.message;
            }
            loginErrorMessage = errorMessage;
            console.log("result errorMessage: ", errorMessage);
            await causeDelay(5000);
            continue;
          } else {
            loginResult = resultJson;
            await handleContacts(resultJson.chatList, resultJson.email);
            await updateContactLogid(email, resultJson.biggestChatLog);
            await updateUserMessages(
              resultJson.loggedInUserId,
              resultJson.chatList
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

export const logoutUserNodejs = async (email: string) => {
  const myWorkingPromise = new Promise(async (resolve, reject) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      };
      let apiEndPoint = "";
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        // dev code
        apiEndPoint = `http://localhost:${port}/login/logout`;
      } else {
        // production code
        apiEndPoint = "/login/logout";
      }
      let result: any = await fetch(apiEndPoint, requestOptions);
      console.log(await result.json(), typeof result);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
  return await myWorkingPromise;
};
