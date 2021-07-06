import { SyntheticEvent } from "react";

export const convertFileToBase64 = async (file: Blob) => {
  const base64Promise = new Promise((resolve, reject) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        // The file's text will be printed here
        if (e.target) resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });

  return await base64Promise;
};

export const readBlobText = async (blob: Blob) => {
  const base64Promise = new Promise((resolve, reject) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        // The file's text will be printed here
        if (e.target) resolve(e.target.result);
      };
      reader.readAsText(blob);
    } catch (error) {
      reject(error);
    }
  });

  return await base64Promise;
};
