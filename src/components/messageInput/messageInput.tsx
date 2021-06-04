import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    const userFileUpload = document.getElementById(
      "userFileUpload"
    ) as HTMLInputElement;
    let files: any = null;
    if (userFileUpload.files) {
      for (const file in userFileUpload.files) {
        if (Object.prototype.hasOwnProperty.call(userFileUpload.files, file)) {
          const selectedFile = userFileUpload.files[file];
          files = Buffer.from(new Uint8Array(await selectedFile.arrayBuffer()));
        }
      }
      console.log(`${files} files selected`);
    }
    if (!currentFocus) {
      alert("Please a contact first");
      return;
    } else {
      console.log(currentFocus);
      const channelId = chatList[currentFocus][`channelId`];
      ws.send(
        JSON.stringify({
          key: "newMessage",
          value: { message, receiver: currentFocus, email, channelId, files },
        })
      );
      dispatch(
        newMessage({
          receiverUserName: currentFocus,
          message: { text: message, received: true },
          senderName: "Self",
        })
      );
    }
  };
  return (
    <div className="messageInputContainer">
      <form className="m-2" onSubmit={sendMessageHandler}>
        <div>
          <input
            type="text"
            className="form-control"
            onInput={(event: any) => setMessage(event.target.value)}
            required
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
