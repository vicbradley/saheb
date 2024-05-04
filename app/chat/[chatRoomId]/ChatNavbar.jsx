import CountdownTimer from "./CountdownTimer";

const ChatNavbar = ({chatPartnerData, formik}) => {
  const { chatPartnerUsername, chatPartnerProfilePicture, chatExpired } = chatPartnerData;

  return (
    <div className="navbar bg-[#f2f2f2] p-2 sticky">
      <div className="flex-1 items-center">
        <div className="ml-4 avatar">
          <div className="w-14 rounded-full">
            <img src={chatPartnerProfilePicture} />
          </div>
        </div>
        <a className="btn btn-ghost normal-case text-xl">{chatPartnerUsername}</a>
      </div>

      <div className="flex-none">
        <CountdownTimer chatExpired={chatExpired} formik={formik} />
      </div>
    </div>
  );
};

export default ChatNavbar;
