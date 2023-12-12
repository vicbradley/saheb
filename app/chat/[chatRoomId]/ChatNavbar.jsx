import { useEffect, useState } from "react";
import { db } from "@/src/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { getUserInfo } from "@/app/logic/getUserInfo";
import Loading from "@/app/components/Loading";
import CountdownTimer from "./CountdownTimer";

const ChatNavbar = (props) => {
  // const {username, profilePicture, chatExpired} = props.otherUserData;
  const { otherUsername, otherUserProfilePicture, chatExpired } = props.otherUserData;

  return (
    <div className="navbar bg-[#f2f2f2] p-2 ">
      <div className="flex-1 items-center">
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
        </svg> */}
        <div className="ml-4 avatar">
          <div className="w-16 rounded-full">
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
