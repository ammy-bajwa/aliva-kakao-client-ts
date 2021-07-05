export interface FetchType {
  bodyUsed: boolean;
  body: ReadableStream<any> | null;
  json(): Promise<any>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}
