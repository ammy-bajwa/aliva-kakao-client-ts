export interface tryLoginApiIN {
  email: string,
  password: string,
  deviceName: string,
  deviceId: string,
  lastMessageTimeStamp: Object,
  latestLogId: Date,
  myAccessToken: string ,
  myRefreshToken: string 
}

export interface resultIn {
  json : Function,
  error : string | undefined,
  message : string,
  chatList : object,
  email : string ,
  loggedInUserId : number,
  biggestChatLog : number , 
  largestTimeStamp : number,
}