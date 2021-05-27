const errors: any = {
  "12": "LOGIN_FAILED_REASON",
  "13": "TOO_MANY_TRY_LOGIN",
  "30": "LOGIN_FAILED",
  "32": "MOBILE_UNREGISTERED",
  "-100": "DEVICE_NOT_REGISTERED",
  "-101": "ANOTHER_LOGON",
  "-102": "DEVICE_REGISTER_FAILED",
  "-110": "INVALID_DEVICE_REGISTER",
  "-111": "INCORRECT_PASSCODE",
  "-112": "PASSCODE_REQUEST_FAILED",
  "-997": "ACCOUNT_RESTRICTED",
};

export const tryLoginApi = async (email: string, password: string) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  };
  let result: any = await fetch("http://localhost:3000/login", requestOptions);
  result = await result.json();
  if (result.error) {
    let errorMessage = errors[`${result.error}`];
    if (!errorMessage) {
      errorMessage = result.message;
    }
    console.log("result: ", errorMessage);
  }
  //   let result = await fetch("http://localhost:3000/login", requestOptions);
  //   result = await result.json();
  //   console.log("result: ", result);
};
