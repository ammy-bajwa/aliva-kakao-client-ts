import { connect } from "react-redux";

import ChatListItem from "../../components/chatListItem/chatListItem";
import Messages from "../../components/messages/messages";

import "./home.css";

const Home = (props: any) => {
  return (
    <div className="d-flex" id="homeMainContainer">
      <div className="chatListContainer border d-flex flex-column flex-wrap m-2 justify-content-center">
        <ChatListItem
          profileImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          name="amir"
        />{" "}
        <ChatListItem
          profileImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          name="ali"
        />
        {props.user.chatList
          ? props.user.chatList.map((item: any, index: number) => (
              <ChatListItem
                profileImage={item.displayUserList[0].profileURL}
                name={item.displayUserList[0].nickname}
                key={index}
              />
            ))
          : ""}
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
