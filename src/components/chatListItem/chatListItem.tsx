import profile from "../../assets/images/profile.png";

import "./chatListItem.css";

const ChatListItem = ({ name, profileImage }: any) => {
  return (
    <div className="chatListItemContainer border d-flex flex-row w-10 m-2 p-2">
      <img
        src={profileImage ? profileImage : profile}
        className="rounded-circle profileWidth"
        alt="profileImage"
      />
      <h3 className="d-inline contactName">{name}</h3>
    </div>
  );
};

export default ChatListItem;
