import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../api/file";
import { errors } from "../../helpers/errorCodes";
import { convertFileToBase64 } from "../../helpers/file";
import { scrollToEndMessages } from "../../helpers/scroll";
import { success } from "../../helpers/toast";
import { newMessage } from "../../redux/action/user";
import "./messageInput.css";

const MessageInput = () => {
  const currentFocus = useSelector((state: any) => state.currentFocus);
  const email = useSelector((state: any) => state.user.email);
  const chatList = useSelector((state: any) => state.user.chatList);
  const ws = useSelector((state: any) => state.ws);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const sendMessageHandler = async (event: any) => {
    try {
      event.preventDefault();
      const sendAt = new Date().getTime();
      const userFileUpload: any = document.getElementById(
        "userFileUpload"
      ) as HTMLInputElement;
      if (!currentFocus) {
        alert("Please a contact first");
        return;
      }
      if (!message && userFileUpload.files.length <= 0) {
        alert("Plase select a file or type some message");
        return;
      }
      if (userFileUpload.files.length > 0) {
        for (const file in userFileUpload.files) {
          if (
            Object.prototype.hasOwnProperty.call(userFileUpload.files, file)
          ) {
            const selectedFile: any = userFileUpload.files[file];
            const base64 = await convertFileToBase64(selectedFile);
            console.log(base64);
            const { path }: any = await uploadFile(selectedFile);
            const channelId = chatList[currentFocus][`channelId`];
            ws.send(
              JSON.stringify({
                key: "newMessageFile",
                value: {
                  message,
                  receiver: currentFocus,
                  filePath: path,
                  email,
                  channelId,
                },
              })
            );

            dispatch(
              newMessage({
                receiverUserName: currentFocus,
                message: {
                  text: "photo",
                  received: true,
                  attachment: { thumbnailUrl: base64 },
                  sendAt,
                },
                senderName: "Self",
              })
            );
          }
        }
      } else {
        console.log(currentFocus);
        const channelId = chatList[currentFocus][`channelId`];
        ws.send(
          JSON.stringify({
            key: "newMessage",
            value: { message, receiver: currentFocus, email, channelId },
          })
        );
        dispatch(
          newMessage({
            receiverUserName: currentFocus,
            message: { text: message, received: true, sendAt },
            senderName: "Self",
          })
        );
        setMessage("");
        const messageContainer: any = document.getElementById(
          "chatWindowContainer"
        ) as HTMLElement;
        messageContainer.scrollTop = messageContainer.scrollHeight;
        // messageContainer.scrollTo(messageContainer.scrollHeight);
        console.log("Fired");
      }
      success("Sended Successfully");
    } catch (error) {
      console.error(errors);
      errors("Error in sending message");
    }
  };
  return (
    <div className="messageInputContainer">
      <form
        className="m-2"
        onSubmit={sendMessageHandler}
        encType="multipart/form-data"
      >
        <div>
          <input
            type="text"
            className="form-control"
            onInput={(event: any) => setMessage(event.target.value)}
            value={message}
          />
        </div>
        <div className="form-group mt-2">
          <input
            type="file"
            className="form-control-file"
            id="userFileUpload"
            accept="image/*"
          />
        </div>
        <button className="btn btn-outline-light mt-2" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
