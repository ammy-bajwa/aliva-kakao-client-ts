const initialState = {
  user: {
    email: "",
    chatList: {},
    accessToken: "",
  },
  chat: [],
};

export const userReducer = function (state: any = initialState, action: any) {
  switch (action.type) {
    case "LOGIN":
      console.log(action);
      state = { ...state, user: action.payload };
      return state;
    case "LOGOUT":
      state = { ...state, user: null };
      return state;
    case "LOAD_CHAT":
      state = { ...state, chat: state.user.chatList[action.payload].messages };
      return state;
    case "NEW_MESSAGE":
      const { receiverUserName, message } = action.payload;
      const chatList = state.user.chatList;
      chatList[receiverUserName].messages.push(message);
      state = Object.assign(state, {
        ...state,
        user: { ...state.user, chatList },
      });
      return state;
    default:
      return state;
  }
};
