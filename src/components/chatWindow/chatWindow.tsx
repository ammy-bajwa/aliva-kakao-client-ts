import moment from "moment";
// import axios from "axios";
import { useEffect } from "react";
// import { deleteDB, openDB } from "idb";

import { useSelector } from "react-redux";
import { scrollToEndMessages } from "../../helpers/scroll";

import "./chatWindow.css";

const ChatWindow = () => {
  const { chat, currentFocus, chatLoading }: any = useSelector((state: any) => {
    const { chat, currentFocus, chatLoading } = state;
    chat.sort((a: any, b: any) => {
      return a.sendAt - b.sendAt;
    });
    return { chat, currentFocus, chatLoading };
  });
  const imageOnClickHandler = async (message: any) => {
    let image = document.createElement("img");
    image.src = message.attachment.url;
    let w: any = window.open("", "_blank");
    w.document.title = "AlivaKakaoClient";
    w.document.title = "AlivaKakaoClient";
    w.document.body.appendChild(image);
    w.location.href = message.attachment.url;
  };

  useEffect(() => {
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
              {message.text === "photo" &&
                message.attachment &&
                message.attachment.thumbnailUrl && (
                  <img
                    loading="lazy"
                    alt="userImages"
                    src={
                      message.attachment.thumbnail
                        ? message.attachment.thumbnail
                        : message.attachment.thumbnailUrl
                    }
                    onClick={() => imageOnClickHandler(message)}
                    className="hoverPointer p-1"
                    width="90"
                    height="90"
                  />
                )}
              {message.text !== "photo" &&
                !message?.attachment?.name &&
                (!message?.attachment || !message.attachment?.thumbnailUrl) && (
                  <span className="m-1 text-wrap">{message.text}</span>
                )}
              {message?.attachment?.name && (
                <span className="m-1 text-wrap">
                  {message?.attachment?.alt}
                </span>
              )}
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
