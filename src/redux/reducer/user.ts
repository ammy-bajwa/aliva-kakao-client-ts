const initialState = {
  user: {
    email: "",
    chatList: {},
    accessToken: "",
  },
  chat: [],
  currentFocus: "",
};

export const userReducer = function (state: any = initialState, action: any) {
  switch (action.type) {
    case "LOGIN":
      console.log(action);
      state = { ...state, user: action.payload };
      return state;
    case "LOGOUT":
      // state = { ...state, user: null };
      return state;
    case "LOAD_CHAT":
      state = { ...state, chat: state.user.chatList[action.payload].messages };
      return state;
    case "SET_FOCUSED_USER":
      state = { ...state, currentFocus: action.payload };
      return state;
    case "NEW_MESSAGE":
      const { receiverUserName, message, senderName } = action.payload;
      // const userMessages = state.messages[receiverUserName];
      // if (!userMessages) {
      //   state.messages[receiverUserName] = [message];
      // } else {
      //   userMessages.concat([message]);
      // }
      // state = Object.assign(state, {
      //   ...state,
      //   messages: userMessages,
      // });
      state = {
        ...state,
        chat: [...state.chat, { receiverUserName, ...message, senderName }],
      };
      return state;
    default:
      return state;
  }
};
