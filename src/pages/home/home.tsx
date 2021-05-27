import { connect } from "react-redux";
import ChatListItem from "../../components/chatListItem/chatListItem";

const Home = (props: any) => {
  return (
    <div className="d-flex flex-row flex-wrap justify-content-center">
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
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Home);
