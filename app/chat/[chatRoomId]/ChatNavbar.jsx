import CountdownTimer from "./CountdownTimer";

const ChatNavbar = (props) => {
  const { otherUsername, otherUserProfilePicture, chatExpired } = props.otherUserData;

  return (
    <div className="navbar bg-[#f2f2f2] p-2 sticky">
      <div className="flex-1 items-center">
        <div className="ml-4 avatar">
          {/* <div className="w-16 rounded-full"> */}
          <div className="w-14 rounded-full">
            <img src={otherUserProfilePicture} />
          </div>
        </div>
        <a className="btn btn-ghost normal-case text-xl">{otherUsername}</a>
      </div>

      <div className="flex-none">
        <CountdownTimer chatExpired={chatExpired} changeChatExpiredState={props.changeChatExpiredState} />
      </div>
    </div>
  );
};

export default ChatNavbar;
