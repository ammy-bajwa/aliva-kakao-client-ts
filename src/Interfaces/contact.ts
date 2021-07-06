export interface ContactJsonResponse {
  data: { chatList: Array<object> | undefined };
  sucess: boolean;
  error: object | undefined;
  message: string | undefined;
}
