export const convertFileToBase64 = async (file: any) => {
  const base64Promise = new Promise((resolve, reject) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        // The file's text will be printed here
        console.log(e.target.result);
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });

  return await base64Promise;
};