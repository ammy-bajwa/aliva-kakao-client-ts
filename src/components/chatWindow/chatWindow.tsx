import { useSelector } from "react-redux";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const chat = useSelector((state: any) => {
    console.log("useSelector");
    return state.chat;
  });

  return (
    <div className="chatWindowContainer m-2">
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
          {message.attachment && (
            <img
              loading="lazy"
              alt="userImages"
              src={message.attachment.thumbnailUrl}
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
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
