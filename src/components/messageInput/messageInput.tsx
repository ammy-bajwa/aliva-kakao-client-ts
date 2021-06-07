import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../api/file";
import { convertFileToBase64 } from "../../helpers/file";
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
    event.preventDefault();
    const userFileUpload: any = document.getElementById(
      "userFileUpload"
    ) as HTMLInputElement;
    let files: any = null;
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
        if (Object.prototype.hasOwnProperty.call(userFileUpload.files, file)) {
          const selectedFile: any = userFileUpload.files[file];
          const base64 = await convertFileToBase64(selectedFile);
          console.log(base64);
          files = Buffer.from(new Uint8Array(await selectedFile.arrayBuffer()));
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
              },
              senderName: "Self",
            })
          );
          const messageContainer: any = document.getElementById(
            "chatWindowContainer"
          ) as HTMLElement;
          messageContainer.scrollTop = messageContainer.scrollHeight;
          // messageContainer.scrollTo(messageContainer.scrollHeight);
          console.log("Fired");
        }
      }
    } else {
      console.log(currentFocus);
      const channelId = chatList[currentFocus][`channelId`];
      const sendAt = new Date().getTime();
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
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            className="form-control-file"
            id="userFileUpload"
          />
        </div>
        <button className="btn btn-info mt-2" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
