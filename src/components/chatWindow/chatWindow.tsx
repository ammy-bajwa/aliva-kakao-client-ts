import moment from "moment";

import { useSelector } from "react-redux";
import { convertFileToBase64 } from "../../helpers/file";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const { chat, currentFocus } = useSelector((state: any) => {
    const { chat, currentFocus } = state;
    chat.sort((a: any, b: any) => {
      return a.sendAt - b.sendAt;
    });
    chat.forEach(async (messageObj: any) => {
      if (
        messageObj.text === "photo" &&
        messageObj.attachment &&
        messageObj.attachment.thumbnailUrl
      ) {
        console.log("messageObj: ", messageObj);
        const result = await fetch(messageObj.attachment.thumbnailUrl, {
          mode: "no-cors",
        });
        const blob = await result.blob();
        const result64 = await convertFileToBase64(blob);
        console.log("result64: ", result64);
      }
    });

    return { chat, currentFocus };
  });

  return (
    <div className="m-2" id="chatWindowContainer">
      {console.log("props: ", props)}
      <h1>Chat Window</h1>
      {chat.length > 0
        ? chat.map((message: any, index: number) => (
            <div
              key={index}
              className={
                message.received
                  ? "d-flex border-bottom m-2 text-light"
                  : "d-flex flex-row-reverse text-light"
              }
            >
              {message.text === "photo" &&
                message.attachment &&
                message.attachment.thumbnailUrl && (
                  <img
                    loading="lazy"
                    alt="userImages"
                    src={message.attachment.thumbnailUrl}
                    onClick={() =>
                      window.open(message.attachment.url, "_blank")
                    }
                    className="hoverPointer"
                    width="90"
                    height="90"
                  />
                )}
              <span
                className={`m-2 p-2 d-block w-100 rounded ${
                  currentFocus === message.receiverUserName
                    ? "receiverMessage border border-info"
                    : "senderMessage border border-dark"
                }`}
              >
                {message.text}
                <hr />
                <span className="w-100 d-flex justify-content-between">
                  <span>{moment(message.sendAt).format("hh:mm:ss A")}</span>
                  <span>{moment(message.sendAt).format("DD/MM/YYYY")}</span>
                </span>
              </span>
            </div>
          ))
        : "Message Will Be Here"}
    </div>
  );
};

export default ChatWindow;
