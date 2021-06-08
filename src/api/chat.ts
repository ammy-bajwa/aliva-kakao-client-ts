import { port } from "../helpers/config";
import { handleIncommingMessages } from "../idb/messages";

export const getUserChat = async (
  email: string,
  nickNameToGetChat: string,
  currentLoggedInUserId: number
) => {
  const setCodePromise = new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickNameToGetChat }),
    };
    let apiEndPoint = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // dev code
      apiEndPoint = `http://localhost:${port}/chat`;
    } else {
      // production code
      apiEndPoint = "/chat";
    }
    let result: any = await fetch(apiEndPoint, requestOptions);
    result = await result.json();
    if (result.error) {
      let errorMessage = result.message;
      alert(errorMessage);
      console.log("result: ", result);
      console.log("errorMessage: ", errorMessage);
      reject(errorMessage);
    } else {
      const { userId, messages } = result.data;
      resolve({ userId, messages });
      await handleIncommingMessages(messages, currentLoggedInUserId, userId);
      console.log(result);
    }
  });

  return await setCodePromise;
};
