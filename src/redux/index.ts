import { createStore } from "redux";
import { userReducer } from "./reducer/user";

export const store = createStore(userReducer);
