const initialState = {
  user: null,
};

export const userReducer = function (state: any = initialState, action: any) {
  switch (action.type) {
    case "LOGIN":
      state = { ...state, user: action.payload };
      return;
    case "LOGOUT":
      state = { ...state, user: null };
      return;
    default:
      return state;
  }
};
