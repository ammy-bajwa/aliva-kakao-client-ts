import { store } from "../redux";

import { setStartLoading, setStopLoading } from "../redux/action/user";

export const startLoading = () => {
  store.dispatch(setStartLoading());
};

export const stopLoading = () => {
  store.dispatch(setStopLoading());
};
