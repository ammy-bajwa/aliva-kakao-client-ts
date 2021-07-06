export const loginUser = (user: object) => ({
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

export const setWs = (ws: object) => ({
  type: "SET_WS",
  payload: ws,
});

export const newMessage = (data: object) => {
  return {
    type: "NEW_MESSAGE",
    payload: data,
  };
};

export const loadChat = (messages: object[]) => ({
  type: "LOAD_CHAT",
  payload: messages,
});

export const setStartLoading = () => ({
  type: "START_LOADING",
  payload: null,
});

export const setStopLoading = () => ({
  type: "STOP_LOADING",
  payload: null,
});

export const setStartChatLoading = () => ({
  type: "START_CHAT_LOADING",
  payload: null,
});

export const setStopChatLoading = () => ({
  type: "STOP_CHAT_LOADING",
  payload: null,
});

export const setContactList = (contactList: object[] | undefined) => ({
  type: "SET_CONTACT_LIST",
  payload: contactList,
});

export const setSending = (sending: boolean) => ({
  type: "SET_SENDING",
  payload: sending,
});
