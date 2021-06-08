import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserChat } from "../../api/chat";
import { scrollToEndMessages } from "../../helpers/scroll";
import { handleIncommingMessages, lastDbMessageTime } from "../../idb/messages";
import { loadChat } from "../../redux/action/user";

import "./chatWindow.css";

const ChatWindow = (props: any) => {
  const dispatch = useDispatch();
  const { chat, currentFocus, email, loggedInUserId, focusedUserId } =
    useSelector((state: any) => {
      const {
        chat,
        currentFocus,
        user: { email, chatList },
        loggedInUserId,
      } = state;
      // console.log("useSelector before: ", chat);
      // chat.sort((a: any, b: any) => {
      //   return a.sendAt - b.sendAt;
      // });
      // console.log("useSelector after: ", chat);
      const focusedUserId =
        chatList[currentFocus]?.displayUserList[0]?.userId?.low;

      return { chat, currentFocus, email, loggedInUserId, focusedUserId };
    });

  useEffect(() => {
    (async () => {
      if (currentFocus) {
        // console.log("Fired");
        // const lastMessageTimeStamp = await lastDbMessageTime(
        //   loggedInUserId,
        //   focusedUserId
        // );
        // console.log(lastMessageTimeStamp);
        // const { messages }: any = await getUserChat(
        //   email,
        //   currentFocus,
        //   loggedInUserId,
        //   lastMessageTimeStamp
        // );
        // dispatch(loadChat(messages));
        // scrollToEndMessages();
      }
    })();
  }, [currentFocus]);
  return (
    <div className="m-2" id="chatWindowContainer">
      {console.log("props: ", props)}
      <h1>Chat Window</h1>
      {chat.map((message: any, index: number) => (
        <div
          key={index}
          className={
            message.received
              ? "d-flex border-bottom m-2"
              : "d-flex flex-row-reverse"
          }
        >
          {message.text === "photo" &&
            message.attachment &&
            message.attachment.thumbnailUrl && (
              <img
                loading="lazy"
                alt="userImages"
                src={message.attachment.thumbnailUrl}
                width="90"
                height="90"
              />
            )}
          <span
            className={
              message.received
                ? "receiverMessage m-2 p-2 d-block w-100"
                : "senderMessage m-2 p-2 d-block"
            }
          >
            <b>text: </b>
            {message.text}
            <b> from: </b>
            {message.senderName}
            <b> to: </b>
            {message.receiverUserName}
            <b> Sened At: </b>
            {message.sendAt}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
