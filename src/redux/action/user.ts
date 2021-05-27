export const loginUser = (user: any) => ({
  type: "LOGIN",
  payload: user,
});

export const logoutUser = () => ({
  type: "LOGOUT",
});
