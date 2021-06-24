import { port } from "../helpers/config";

export const getChatList = async (email: string) => {
  const setCodePromise = new Promise(async (resolve, reject) => {
    // startLoading();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };
    let apiEndPoint = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // dev code
      apiEndPoint = `http://localhost:${port}/contact`;
    } else {
      // production code
      apiEndPoint = "/contact";
    }
    let result: any = await fetch(apiEndPoint, requestOptions);
    result = await result.json();
    // stopLoading();
    if (result.error) {
      let errorMessage = result.message;
      alert(errorMessage);
      console.log("result: ", result);
      console.log("errorMessage: ", errorMessage);
      reject(errorMessage);
    } else {
      const { chatList } = result.data;
      resolve(chatList);
      console.log(result);
    }
  });

  return await setCodePromise;
};
