import "./messageInput.css";

const MessageInput = () => {
  const sendMessageHandler = (event: any) => {
    event.preventDefault();
  };
  return (
    <div className="messageInputContainer">
      <form onClick={sendMessageHandler}>
        <div className="m-2">
          <input type="text" className="form-control" required />
          <button className="btn btn-info mt-2" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
