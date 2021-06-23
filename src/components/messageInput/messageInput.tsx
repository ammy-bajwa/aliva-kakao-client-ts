import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../api/file";
import { errors } from "../../helpers/errorCodes";
import { success, error } from "../../helpers/toast";
import { newMessage, setSending } from "../../redux/action/user";
import "./messageInput.css";

const MessageInput = () => {
  const currentFocus = useSelector((state: any) => state.currentFocus);
  const email = useSelector((state: any) => state.user.email);
  // const loggedInUserId = useSelector((state: any) => state.loggedInUserId);
  const chatList = useSelector((state: any) => state.user.chatList);
  const isSending = useSelector((state: any) => state.isSending);
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
      dispatch(setSending(true));
      if (userFileUpload.files.length > 0) {
        for (const file in userFileUpload.files) {
          if (
            Object.prototype.hasOwnProperty.call(userFileUpload.files, file)
          ) {
            const selectedFile: any = userFileUpload.files[file];
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
          }
        }
        userFileUpload.value = "";
      } else {
        console.log(currentFocus);
        const channelId = chatList[currentFocus][`channelId`];
        ws.send(
          JSON.stringify({
            key: "newMessage",
            value: { message, receiver: currentFocus, email, channelId },
          })
        );
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      error("Error in sending message");
      dispatch(setSending(false));
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
            autoFocus
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
        <button
          disabled={isSending ? true : false}
          className="btn btn-outline-light mt-2"
          type="submit"
        >
          {isSending ? (
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
