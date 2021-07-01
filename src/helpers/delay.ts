export const causeDelay = async (time: number) => {
  const myTaskPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

  return await myTaskPromise;
};
