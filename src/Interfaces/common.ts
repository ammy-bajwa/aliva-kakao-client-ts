export interface FetchType {
  bodyUsed: boolean;
  body: ReadableStream<any> | null;
  json(): Promise<any>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

export interface MessageType {
  sender: any;
  receiverUser: any;
  text: string;
  attachment: {
    thumbnailUrl: string | undefined;
    url: string | undefined;
    thumbnailUrls: string[] | undefined;
    thumbnailKey: string | undefined;
    mt: string | undefined;
    mtl: string[] | undefined;
    audioBase64: string | undefined;
  };
  thumbnail: string | undefined;
  thumbnails: string[] | undefined;
  audio: string | undefined;
  received: boolean;
  sendAt: number;
  logId: number;
}
