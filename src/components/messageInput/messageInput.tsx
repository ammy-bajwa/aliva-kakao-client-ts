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
  const sendMessageHandler = (event: any) => {
    event.preventDefault();
    if (!currentFocus) {
      alert("Please a contact first");
      return;
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
          message: { text: message, received: true },
          senderName: "Self",
        })
      );
    }
  };
  return (
    <div className="messageInputContainer">
      <form onSubmit={sendMessageHandler}>
        <div className="m-2">
          <input
            type="text"
            className="form-control"
            onInput={(event: any) => setMessage(event.target.value)}
            required
          />
          <button className="btn btn-info mt-2" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
