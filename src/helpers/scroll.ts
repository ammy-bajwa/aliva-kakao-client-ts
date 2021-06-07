export const scrollToEndMessages = () => {
  const messageElement = document.getElementById(
    "messageContainer"
  ) as HTMLElement;
  messageElement.scrollTop = messageElement.scrollHeight;
};
