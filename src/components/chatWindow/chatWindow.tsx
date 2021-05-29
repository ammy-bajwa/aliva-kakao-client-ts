import { connect } from "react-redux";
import "./chatWindow.css";

const ChatWindow = (props: any) => {
  return (
    <div className="ChatWindowContainer">
      {props.chat
        ? props.chat.map(({ text, received }: any, index: number) => (
            <div
              key={index}
              className={received ? "d-flex" : "d-flex flex-row-reverse"}
            >
              <span
                className={
                  received
                    ? "receiverMessage border m-2 p-2 d-inline-block"
                    : "senderMessage border m-2 p-2 d-inline-block"
                }
              >
                {text}
              </span>
            </div>
          ))
        : ""}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    chat: state.chat,
  };
};

export default connect(mapStateToProps)(ChatWindow);
