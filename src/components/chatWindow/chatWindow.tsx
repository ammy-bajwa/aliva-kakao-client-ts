import moment from "moment";
import { useEffect } from "react";

import { ImgMessageHandler } from "./imgMessageHandler/imgMessageHandler";

import { useSelector } from "react-redux";
import { scrollToEndMessages } from "../../helpers/scroll";

import "./chatWindow.css";
import { ReduxStore } from "../../Interfaces/store";

interface MessageType {
  sendAt: number;
}

const ChatWindow = () => {
  const {
    chat,
    currentFocus,
    chatLoading,
  }: { chat: object[]; currentFocus: string; chatLoading: boolean } =
    useSelector((state: ReduxStore) => {
      const { chat, currentFocus, chatLoading } = state;
      chat.sort((a: any, b: any) => {
        return a.sendAt - b.sendAt;
      });
      return { chat, currentFocus, chatLoading };
    });

  useEffect(() => {
    console.log("chat: ", chat);
    scrollToEndMessages();
  }, [chatLoading, chat]);

  return (
    <div className="m-2" id="chatWindowContainer">
      <h1>Chat Window</h1>
      {chatLoading && "Loading....."}
      {!chatLoading &&
        chat?.length > 0 &&
        chat.map((message: any, index: number) => (
          <div
            key={index}
            className={`text-light p-1 w-100 d-flex flex-row ${
              currentFocus === message.receiverUserName
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`border border-dark rounded p-1 ${
                currentFocus === message.receiverUserName
                  ? "receiverMessage"
                  : "senderMessage"
              }`}
            >
              {message.attachment && message.attachment.thumbnailUrl && (
                <ImgMessageHandler
                  source={message.attachment.thumbnailUrl}
                  url={message.attachment.url}
                />
              )}
              {message.text === "voice note" && (
                <audio
                  controls
                  src={message?.audio ? message.audio : message?.attachment.url}
                ></audio>
              )}
              {message.text !== "photo" &&
                message.text !== "voice note" &&
                !message?.attachment?.name &&
                !message?.attachment?.thumbnailUrls &&
                (!message?.attachment || !message.attachment?.thumbnailUrl) && (
                  <span className="m-1 text-wrap">{message.text}</span>
                )}
              {message?.attachment?.name && (
                <span className="m-1 text-wrap">
                  {message?.attachment?.alt}
                </span>
              )}
              {!message?.thumbnails &&
                message?.attachment?.thumbnailUrls &&
                message.attachment.thumbnailUrls.map(
                  (imgUrl: string, index: number) => (
                    <ImgMessageHandler
                      source={imgUrl}
                      key={index}
                      url={message.attachment.imageUrls[index]}
                    />
                  )
                )}
              {message?.thumbnails &&
                message.thumbnails.map((imgUrl: string, index: number) => (
                  <ImgMessageHandler
                    source={imgUrl}
                    key={index}
                    url={message.attachment.imageUrls[index]}
                  />
                ))}
              <span className="small bg-secondary makeItLight rounded p-1">
                {moment(message.sendAt).format("hh:mm:ss A DD/MM/YYYY")}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatWindow;
