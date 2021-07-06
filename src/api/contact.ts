import { port } from "../helpers/config";
import { FetchType } from "../Interfaces/common";
import { ContactJsonResponse } from "../Interfaces/contact";

export const getChatList = async (email: string) => {
  const setCodePromise = new Promise(
    async (resolve: (value: object[] | undefined) => void, reject) => {
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
      let result: FetchType = await fetch(apiEndPoint, requestOptions);
      let resultJson: ContactJsonResponse = await result.json();
      // stopLoading();
      if (resultJson.error) {
        let errorMessage = resultJson.message;
        alert(errorMessage);
        reject(errorMessage);
      } else {
        const { chatList } = resultJson.data;
        resolve(chatList);
      }
    }
  );

  return await setCodePromise;
};
