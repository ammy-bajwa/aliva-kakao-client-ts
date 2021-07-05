export interface ContactJsonResponse {
  data: { chatList: Array<any> | undefined };
  sucess: boolean;
  error: object | undefined;
  message: string | undefined;
}
