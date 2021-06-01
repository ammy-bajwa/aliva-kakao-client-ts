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
      {chat.map(
        (
          { text, received, receiverUserName, senderName }: any,
          index: number
        ) => (
          <div
            key={index}
            className={
              received ? "d-flex border-bottom m-2" : "d-flex flex-row-reverse"
            }
          >
            <span
              className={
                received
                  ? "receiverMessage m-2 p-2 d-block w-100"
                  : "senderMessage m-2 p-2 d-block"
              }
            >
              <b>text: </b>
              {text}
              <b> from: </b>
              {senderName}
              <b> to: </b>
              {receiverUserName}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default ChatWindow;
