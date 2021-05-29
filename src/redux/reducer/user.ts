const initialState = {
  user: {
    email: "",
    chatList: {},
    accessToken: "",
  },
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
    case "NEW_MESSAGE":
      const { receiverUserName, message } = action.payload;
      const chatList = state.user.chatList;
      chatList[receiverUserName].messages.push(message);
      const newState = {
        ...state,
        user: { ...state.user, chatList },
      };
      return newState;
    default:
      return state;
  }
};
