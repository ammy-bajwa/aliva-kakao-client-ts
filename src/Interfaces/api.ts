export interface tryLoginApiIN {
  email: string;
  password: string;
  deviceName: string;
  deviceId: string;
  lastMessageTimeStamp: Object;
  latestLogId: Date;
  myAccessToken: string;
  myRefreshToken: string;
}

export interface resultIn {
  email: string;
  loggedInUserId: number;
  accessToken: string;
  refreshToken: string;
  chatList: object;
  biggestChatLog: number;
  error: string | undefined | null;
  message: string | undefined;
}

export interface LoginFetchType {
  bodyUsed: boolean;
  body: ReadableStream<any> | null;
  json(): Promise<any>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}
