import { port } from "../helpers/config";
import { FetchType } from "../Interfaces/common";
import { store } from "../redux";

export const uploadFile = async (file: any) => {
  const fileUploadPromise = new Promise(
    async (resolve: (value: { path: string }) => void, reject) => {
      try {
        const {
          user: { accessToken },
        } = store.getState();
        if (accessToken) {
          console.log("accessToken: ", accessToken);
          var data = new FormData();
          data.append("myFile", file);
          const requestOptions = {
            method: "POST",
            body: data,
          };
          let apiEndPoint = "";
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            // dev code
            apiEndPoint = `http://localhost:${port}/uploadfile`;
          } else {
            // production code
            apiEndPoint = "/uploadfile";
          }
          const result: FetchType = await fetch(apiEndPoint, requestOptions);
          const resultJson = await result.json();
          console.log("result: ", resultJson);
          resolve(resultJson);
        }
      } catch (error) {
        reject(error);
      }
    }
  );
  return await fileUploadPromise;
};
