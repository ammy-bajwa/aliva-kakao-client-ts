import { connect } from "react-redux";

const Home = (props: any) => {
  return (
    <div>
      {props.user.chatList
        ? props.user.chatList.map((item: any, index: number) => (
            <div key={index}>
              <h3>{item.displayUserList[0].nickname}</h3>
              <img
                src={item.displayUserList[0].profileURL}
                alt="profileImage"
              />
            </div>
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
