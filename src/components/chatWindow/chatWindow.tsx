import { useEffect } from "react";
import { useSelector } from "react-redux";
import { scrollToEndMessages } from "../../helpers/scroll";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const chat = useSelector((state: any) => {
    const { chat } = state;
    console.log("useSelector before: ", chat);
    chat.sort((a: any, b: any) => {
      return a.sendAt - b.sendAt;
    });
    console.log("useSelector after: ", chat);
    return chat;
  });

  useEffect(() => {
    scrollToEndMessages();
  }, [chat]);
  return (
    <div className="m-2" id="chatWindowContainer">
      {console.log("props: ", props)}
      <h1>Chat Window</h1>
      {chat.map((message: any, index: number) => (
        <div
          key={index}
          className={
            message.received
              ? "d-flex border-bottom m-2"
              : "d-flex flex-row-reverse"
          }
        >
          {message.text === "photo" &&
            message.attachment &&
            message.attachment.thumbnailUrl && (
              <img
                loading="lazy"
                alt="userImages"
                src={message.attachment.thumbnailUrl}
                width="90"
                height="90"
              />
            )}
          <span
            className={
              message.received
                ? "receiverMessage m-2 p-2 d-block w-100"
                : "senderMessage m-2 p-2 d-block"
            }
          >
            <b>text: </b>
            {message.text}
            <b> from: </b>
            {message.senderName}
            <b> to: </b>
            {message.receiverUserName}
            <b> Sened At: </b>
            {message.sendAt}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
