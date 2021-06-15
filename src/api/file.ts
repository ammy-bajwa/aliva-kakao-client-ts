import { port } from "../helpers/config";
import { store } from "../redux";
import { startLoading, stopLoading } from "../utils/loading";

export const uploadFile = async (file: any) => {
  const fileUploadPromise = new Promise(async (resolve, reject) => {
    try {
      const {
        user: { accessToken },
      } = store.getState();
      if (accessToken) {
        console.log("accessToken: ", accessToken);
        var data = new FormData();
        data.append("myFile", file);
        startLoading();
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
        let result: any = await fetch(apiEndPoint, requestOptions);
        result = await result.json();
        console.log("result: ", result);
        stopLoading();
        resolve(result);
      }
    } catch (error) {
      stopLoading();
      reject(error);
    }
  });
  return await fileUploadPromise;
};
