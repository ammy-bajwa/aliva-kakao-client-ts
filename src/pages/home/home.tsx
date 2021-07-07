import { connect, useDispatch } from "react-redux";

import ChatListItem from "../../components/chatListItem/chatListItem";
import Messages from "../../components/messages/messages";
import { refreshContactList } from "../../helpers/contact";
import { refreshMessages } from "../../helpers/messages";
import { ReduxStore } from "../../Interfaces/store";
import {
  setStartChatLoading,
  setStopChatLoading,
} from "../../redux/action/user";

import "./home.css";

const Home = (props: any) => {
  const dispatch = useDispatch();
  const onClickHandler = async (name: string) => {
    dispatch(setStartChatLoading());
    await refreshMessages(name);
    await refreshContactList();
    dispatch(setStopChatLoading());
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
            profileImage={item.profileURL}
            name={item.nickname}
            key={index}
            onClickHandler={() => {
              return onClickHandler(item.nickname);
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
        {props.user.chatList ? getChatListItems() : ""}
      </div>
      <div className="border m-2 rounded" id="messageContainer">
        <Messages />
      </div>
    </div>
  );
};

const mapStateToProps = (state: ReduxStore) => {
  return {
    user: state.user,
    loggedInUserId: state.loggedInUserId,
    ws: state.ws,
  };
};

export default connect(mapStateToProps)(Home);
