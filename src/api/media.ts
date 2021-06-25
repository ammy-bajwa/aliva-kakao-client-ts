import { port } from "../helpers/config";
import { convertFileToBase64 } from "../helpers/file";
// import { startLoading, stopLoading } from "../utils/loading";

export const getImg = async () => {
  const myTaskPromise = new Promise(async (resolve, reject) => {
    let apiEndPoint = "";
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // dev code
      apiEndPoint = `http://localhost:${port}/media`;
    } else {
      // production code
      apiEndPoint = "/media";
    }
    let result: any = await fetch(apiEndPoint);
    // result = await result.body;
    // console.log("result: ", result.readAb);

    const reader = await result.body?.getReader();
    let myBlobs = [];
    while (true) {
      const { value, done } = await reader?.read();
      //   console.log("base64String: ", base64String);
      if (done) {
        break;
      } else {
        const myBlob = new Blob([value], { type: "image/png" });
        myBlobs.push(myBlob);
        console.log("fired");
      }
    }

    const myFile = new Blob(myBlobs, { type: "image/png" });
    var base64String = await convertFileToBase64(myFile);
    console.log("blob: ", myFile);
    console.log("base64String: ", base64String);
    resolve(true);
  });

  return await myTaskPromise;
};
