import moment from "moment";
import { useEffect } from "react";
// import { deleteDB, openDB } from "idb";

import { useSelector } from "react-redux";
// import { convertFileToBase64 } from "../../helpers/file";
import { scrollToEndMessages } from "../../helpers/scroll";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  function convertImgToBase64URL(url: any, callback: any) {
    var img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas: any = document.createElement("CANVAS"),
        ctx = canvas.getContext("2d"),
        dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL();
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }

  const { chat, currentFocus } = useSelector((state: any) => {
    const { chat, currentFocus } = state;
    chat.sort((a: any, b: any) => {
      return a.sendAt - b.sendAt;
    });
    chat.forEach(async (messageObj: any) => {
      console.log("fired");
      if (
        messageObj.text === "photo" &&
        messageObj.attachment &&
        messageObj.attachment.thumbnailUrl
      ) {
        // console.log("messageObj: ", messageObj);
        convertImgToBase64URL(
          messageObj.attachment.thumbnailUrl,
          function (base64Img: any) {
            console.log("Called");
            console.log(base64Img);
          }
        );
        // const result = await fetch(messageObj.attachment.thumbnailUrl, {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     Accept: "img/jpg",
        //     "Content-Type": "img/jpg",
        //   },
        //   mode: "no-cors",
        // });
        // const blob = await result.blob();
        // console.log("img blob: ", await result);
        // console.log("img blob: ", blob.type);
        // const result64 = await convertFileToBase64(blob);
        // const db = await openDB(messageObj.attachment.thumbnailUrl, 1, {
        //   upgrade(db) {
        //     db.createObjectStore("blob");
        //   },
        // });
        // await db.put("blob", blob, 1);
        // db.close();
        // console.log("BlobImage123", blob);
        // console.log("result64: ", result64.length);
      }
    });

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
                      // onLoad={
                      // (event: any) => {
                      // var canvas = document.createElement("canvas");
                      // canvas.width = event.target.width;
                      // canvas.height = event.target.height;
                      // var ctx: any = canvas.getContext("2d");
                      // ctx.drawImage(event.target, 0, 0);
                      // var dataURL = canvas.toDataURL("image/png");
                      // console.log(
                      //   dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
                      // );
                      // }
                      // }
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
