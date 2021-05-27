import profile from "../../assets/images/profile.png";

import "./chatListItem.css";

const ChatListItem = ({ name, profileImage }: any) => {
  return (
    <div className="card profileWidth w-10 m-2 p-2">
      <img
        src={profileImage ? profileImage : profile}
        className="card-img-top"
        alt="profileImage"
      />
      <div className="card-body text-center">
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default ChatListItem;
