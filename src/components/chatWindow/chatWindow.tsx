import { useSelector } from "react-redux";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const chat = useSelector((state: any) => {
    console.log("useSelector");
    return state.chat;
  });

  return (
    <div className="ChatWindowContainer">
      {console.log("props: ", props)}
      <h1>Chat Window</h1>
      {chat.map(({ text, received }: any, index: number) => (
        <div
          key={index}
          className={received ? "d-flex" : "d-flex flex-row-reverse"}
        >
          <span
            className={
              received
                ? "receiverMessage border m-2 p-2 d-inline-block"
                : "senderMessage border m-2 p-2 d-inline-block"
            }
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
