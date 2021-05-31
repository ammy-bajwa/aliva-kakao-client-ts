import { connect } from "react-redux";

import ChatListItem from "../../components/chatListItem/chatListItem";
import Messages from "../../components/messages/messages";
import { setFocusUser } from "../../redux/action/user";
// import { loadChat } from "../../redux/action/user";

import "./home.css";

const Home = (props: any) => {
  const onClickHandler = (name: string) => {
    props.dispatch(setFocusUser(name));
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
            onClickHandler={() =>
              onClickHandler(item.displayUserList[0].nickname)
            }
          />
        );
        index++;
      }
    }

    return items;
  };
  return (
    <div className="d-flex" id="homeMainContainer">
      <div className="chatListContainer border d-flex flex-column flex-wrap m-2 justify-content-center">
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
      <div className="border m-2 messageContainer">
        <Messages />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Home);
