import { ReactEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../api/file";
// import { errors } from "../../helpers/errorCodes";
import { error } from "../../helpers/toast";
import { ReduxStore } from "../../Interfaces/store";
import { setSending } from "../../redux/action/user";
import "./messageInput.css";

const MessageInput = () => {
  const [currentSelectedFile, setSelectedFile] = useState({ name: "" });
  const currentFocus = useSelector((state: ReduxStore) => state.currentFocus);
  const email = useSelector((state: ReduxStore) => state.user.email);
  // const loggedInUserId = useSelector((state: ReduxStore) => state.loggedInUserId);
  const chatList: any = useSelector((state: ReduxStore) => state.user.chatList);
  const isSending = useSelector((state: ReduxStore) => state.isSending);
  const ws = useSelector((state: ReduxStore) => state.ws);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];
      setSelectedFile(fileObject);
      console.log(currentSelectedFile);
    } else {
      alert(
        "No image data was found in your clipboard. Copy an image first or take a screenshot."
      );
    }
  };
  const sendMessageHandler = async (): Promise<void> => {
    try {
      const userFileUpload: any = document.getElementById(
        "userFileUpload"
      ) as HTMLInputElement;
      if (!currentFocus) {
        alert("Please a contact first");
        return;
      }
      if (
        !message &&
        userFileUpload.files.length <= 0 &&
        !currentSelectedFile
      ) {
        alert("Plase select a file or type some message");
        return;
      }
      dispatch(setSending(true));
      if (userFileUpload.files.length > 0 || currentSelectedFile.name) {
        if (currentSelectedFile.name) {
          const { path }: { path: string } = await uploadFile(
            currentSelectedFile
          );
          const channelId = chatList[currentFocus][`channelId`];
          if (ws) {
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
          setSelectedFile({ name: "" });
        } else {
          for (const file in userFileUpload.files) {
            if (
              Object.prototype.hasOwnProperty.call(userFileUpload.files, file)
            ) {
              const selectedFile: object = userFileUpload.files[file];
              const { path }: { path: string } = await uploadFile(selectedFile);
              const channelId = chatList[currentFocus][`channelId`];
              if (ws) {
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
          }
        }
        userFileUpload.value = "";
        setSelectedFile({ name: "" });
      } else {
        const receiverIntId = chatList[currentFocus][`intId`];
        ws.send(
          JSON.stringify({
            key: "newMessage",
            value: { message, receiver: currentFocus, email, receiverIntId },
          })
        );
        setMessage("");
      }
      dispatch(setSending(false));
    } catch (err) {
      console.error(err);
      error("Error in sending message");
      dispatch(setSending(false));
    }
  };
  return (
    <div className="messageInputContainer">
      <span className="m-2">
        Selected file{" "}
        <span className="text-danger">{currentSelectedFile.name}</span>
      </span>
      <form
        className="m-2"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessageHandler();
        }}
        encType="multipart/form-data"
      >
        <div>
          <input
            type="text"
            autoFocus
            className="form-control"
            onInput={(event: React.FormEvent<HTMLInputElement>) => {
              const currentElement = event.target as HTMLInputElement;
              setMessage(currentElement.value);
            }}
            value={message}
            onPaste={handlePaste}
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
