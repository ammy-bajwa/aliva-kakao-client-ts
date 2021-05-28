import "./chatWindow.css";

const ChatWindow = () => {
  const data = [
    {
      text: "hello",
      received: true,
    },
    {
      text: "hello",
      received: false,
    },
    {
      text: "hello",
      received: true,
    },
    {
      text: "hello",
      received: false,
    },
    {
      text: "hello",
      received: true,
    },
  ];
  return (
    <div className="ChatWindowContainer">
      {data.map(({ text, received }, index) => (
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
      ))}
    </div>
  );
};

export default ChatWindow;
