import { connect } from "react-redux";

import ChatListItem from "../../components/chatListItem/chatListItem";
import Messages from "../../components/messages/messages";
import { refreshMessages } from "../../helpers/messages";

import "./home.css";

const Home = (props: any) => {
  const onClickHandler = async (name: string) => {
    await refreshMessages(name);
  };

  const getChatListItems = () => {
    const items = [];
    let index = 0;
    const chatList = props.user.chatList;
    for (const key in chatList) {
      if (Object.prototype.hasOwnProperty.call(chatList, key)) {
        const item = chatList[key];
        items.push(
          <ChatListItem
            profileImage={item.displayUserList[0].profileURL}
            name={item.displayUserList[0].nickname}
            key={index}
            onClickHandler={() => {
              return onClickHandler(item.displayUserList[0].nickname);
            }}
          />
        );
        index++;
      }
    }

    return items;
  };
  return (
    <div className="d-flex rounded" id="homeMainContainer">
      <div className="chatListContainer border rounded d-flex flex-column flex-wrap m-2 justify-content-center">
        {/* <ChatListItem
          profileImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          name="amir"
        />{" "}
        <ChatListItem
          profileImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          name="ali"
        /> */}
        {props.user.chatList ? getChatListItems() : ""}
      </div>
      <div className="border m-2 rounded" id="messageContainer">
        <Messages />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    loggedInUserId: state.loggedInUserId,
    ws: state.ws,
  };
};

export default connect(mapStateToProps)(Home);
