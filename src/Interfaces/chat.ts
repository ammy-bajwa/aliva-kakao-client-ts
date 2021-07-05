export interface data {
    userId: string;
    messages: [];
  }

export  interface newResultType {
    json: Function;
    error: string | undefined;
    data: data;
    message: string;
  }

 export interface resultType {
    json: Function;
  }
