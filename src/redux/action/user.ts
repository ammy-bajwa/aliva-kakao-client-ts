export const loginUser = (user: any) => ({
  type: "LOGIN",
  payload: user,
});

export const logoutUser = () => ({
  type: "LOGOUT",
});

export const newMessage = (messageData: any) => ({
  type: "NEW_MESSAGE",
  payload: messageData,
});
