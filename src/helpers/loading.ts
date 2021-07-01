export const setLoginLoadingMessage = (message: string) => {
  const loginTryMessage = document.getElementById("loginTryMessage");
  if (loginTryMessage) {
    loginTryMessage.innerText = message;
  }
};
