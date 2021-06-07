export const loginUser = (user: any) => ({
  type: "LOGIN",
  payload: user,
});

export const logoutUser = () => ({
  type: "LOGOUT",
});

export const setFocusUser = (name: string) => ({
  type: "SET_FOCUSED_USER",
  payload: name,
});

export const setWs = (ws: any) => ({
  type: "SET_WS",
  payload: ws,
});

export const newMessage = (data: any) => ({
  type: "NEW_MESSAGE",
  payload: data,
});

export const loadChat = (messages: any) => ({
  type: "LOAD_CHAT",
  payload: messages,
});

export const setStartLoading = () => ({
  type: "START_LOADING",
});

export const setStopLoading = () => ({
  type: "STOP_LOADING",
});
