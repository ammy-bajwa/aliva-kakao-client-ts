export interface ReduxStore {
  user: {
    accessToken: string;
    email: string;
    chatList: object;
  };
  chat: object[];
  currentFocus: string;
  chatLoading: boolean;
  isSending: boolean;
  loggedInUserId: string;
  loading: boolean;
  ws: any;
}
