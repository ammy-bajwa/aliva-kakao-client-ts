import moment from "moment";
import { useEffect } from "react";
import { deleteDB, openDB } from "idb";

import { useSelector } from "react-redux";
// import { convertFileToBase64 } from "../../helpers/file";
import { scrollToEndMessages } from "../../helpers/scroll";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const { chat, currentFocus } = useSelector((state: any) => {
    const { chat, currentFocus } = state;
    chat.sort((a: any, b: any) => {
      return a.sendAt - b.sendAt;
    });
    // chat.forEach(async (messageObj: any) => {
    //   console.log("fired");
    //   if (
    //     messageObj.text === "photo" &&
    //     messageObj.attachment &&
    //     messageObj.attachment.thumbnailUrl
    //   ) {
    //     console.log("messageObj: ", messageObj);
    //     const result = await fetch(messageObj.attachment.thumbnailUrl, {
    //       mode: "no-cors",
    //     });
    //     const blob = await result.blob();
    //     // const result64 = await convertFileToBase64(blob);
    //     const db = await openDB(messageObj.attachment.thumbnailUrl, 1, {
    //       upgrade(db) {
    //         db.createObjectStore("blob");
    //       },
    //     });
    //     await db.put("blob", blob, 1);
    //     db.close();
    //     console.log("BlobImage123", blob);
    //     // console.log("result64: ", result64.length);
    //   }
    // });

    return { chat, currentFocus };
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
  }, [chat]);

  return (
    <div className="m-2" id="chatWindowContainer">
      <h1>Chat Window</h1>
      {chat.length > 0
        ? chat.map((message: any, index: number) => (
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
                      src={message.attachment.thumbnailUrl}
                      onClick={() => imageOnClickHandler(message)}
                      className="hoverPointer p-1"
                      width="90"
                      height="90"
                    />
                  )}
                {message.text !== "photo" &&
                  (!message?.attachment ||
                    !message.attachment?.thumbnailUrl) && (
                    <span className="m-1 text-wrap">{message.text} </span>
                  )}
                <span className="small bg-secondary makeItLight rounded p-1">
                  {moment(message.sendAt).format("hh:mm:ss A DD/MM/YYYY")}
                </span>
              </div>
            </div>
          ))
        : "Message Will Be Here"}
    </div>
  );
};

export default ChatWindow;
