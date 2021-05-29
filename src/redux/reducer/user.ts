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
    default:
      return state;
  }
};
