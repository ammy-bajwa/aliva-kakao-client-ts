import "./messageInput.css";

const MessageInput = () => {
  return (
    <div className="messageInputContainer">
      <form>
        <div className="m-2">
          <input
            type="email"
            className="form-control"
            id="userEmail"
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
