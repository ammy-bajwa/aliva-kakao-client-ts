const initialState = {
  user: {
    email: "",
    chatList: {},
    accessToken: "",
  },
  loggedInUserId: "",
  chat: [],
  currentFocus: "",
  ws: null,
  loading: false,
};

export const userReducer = function (state: any = initialState, action: any) {
  switch (action.type) {
    case "LOGIN":
      console.log(action);
      state = {
        ...state,
        user: {
          email: action.payload.email,
          chatList: action.payload.chatList,
          accessToken: action.payload.accessToken,
        },
        loggedInUserId: action.payload.loggedInUserId,
        chat: [],
      };
      return state;
    case "LOGOUT":
      state = {
        ...state,
        user: {
          email: "",
          chatList: {},
          accessToken: "",
        },
      };
      return state;
    case "LOAD_CHAT":
      state = { ...state, chat: action.payload };
      return state;
    case "START_LOADING":
      state = { ...state, loading: true };
      return state;
    case "STOP_LOADING":
      state = { ...state, loading: false };
      return state;
    case "SET_FOCUSED_USER":
      state = { ...state, currentFocus: action.payload };
      return state;
    case "SET_WS":
      state = { ...state, ws: action.payload };
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
