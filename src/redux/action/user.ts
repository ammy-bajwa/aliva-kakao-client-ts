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

export const newMessage = (data: any) => {
  return {
    type: "NEW_MESSAGE",
    payload: data,
  };
};

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

export const setStartChatLoading = () => ({
  type: "START_CHAT_LOADING",
});

export const setStopChatLoading = () => ({
  type: "STOP_CHAT_LOADING",
});

export const setContactList = (contactList: any) => ({
  type: "SET_CONTACT_LIST",
  payload: contactList,
});

export const setSending = (sending: boolean) => ({
  type: "SET_SENDING",
  payload: sending,
});
