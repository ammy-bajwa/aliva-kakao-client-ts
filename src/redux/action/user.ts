export const loginUser = (user: any) => ({
  type: "LOGIN",
  payload: user,
});

export const logoutUser = () => ({
  type: "LOGOUT",
});

export const newMessage = (data: any) => ({
  type: "NEW_MESSAGE",
  payload: data,
});

export const loadChat = (name: string) => ({
  type: "LOAD_CHAT",
  payload: name,
});
