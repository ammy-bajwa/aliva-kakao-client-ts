import { useSelector } from "react-redux";
import profile from "../../assets/images/profile.png";

import "./chatListItem.css";

const ChatListItem = ({
  name,
  profileImage,
  newChatCount,
  onClickHandler,
}: any) => {
  const currentFocus = useSelector((state: any) => state.currentFocus);
  return (
    <div
      className={`chatListItemContainer border rounded d-flex flex-row w-10 m-2 p-2 ${
        currentFocus === name && "focusedContact"
      }`}
      onClick={onClickHandler}
    >
      <div>
        <img
          src={profileImage ? profileImage : profile}
          className="rounded-circle profileWidth"
          alt="profileImage"
        />
        <h3 className="d-inline contactName">{name}</h3>
      </div>
    </div>
  );
};

export default ChatListItem;
