import { port } from "../helpers/config";
// import { startLoading, stopLoading } from "../utils/loading";
import { resultType, newResultType } from "../Interfaces/chat";

export const getUserChat = async (
  email: string,
  nickNameToGetChat: string,
  lastMessageTimeStamp: number,
  lastChatLogId: string,
  logId: string
) => {
  const setCodePromise = new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        nickNameToGetChat,
        lastMessageTimeStamp,
        lastChatLogId,
        startChatLogId: logId,
      }),
    };
    let apiEndPoint = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // dev code
      apiEndPoint = `http://localhost:${port}/chat`;
    } else {
      // production code
      apiEndPoint = "/chat";
    }

    let result: resultType = await fetch(apiEndPoint, requestOptions);
    let newResult: newResultType = await result.json();
    if (newResult.error) {
      let errorMessage = newResult.message;
      alert(errorMessage);
      console.log("result: ", newResult);
      console.log("errorMessage: ", errorMessage);
      reject(errorMessage);
    } else {
      const { userId, messages } = newResult.data;
      resolve({ userId, messages });
      console.log(newResult);
    }
  });

  return await setCodePromise;
};
