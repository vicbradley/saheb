"use client";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/Auth";
import { useMessageContext } from "../context/Message";
import EmptyPage from "../components/EmptyPage";

const Chat = () => {
  const { chatRoomsData, isChatRoomsDataReady } = useMessageContext();

  const { push } = useRouter();
  const { isAuth } = useAuthContext();

  const trimLongMessage = (msg) => {
    if (msg.length > 30) {
      return msg.substring(0, 30) + "...";
    } else {
      return msg;
    }
  };

  if (!isAuth) return <EmptyPage text="Sign In First" />;

  if (!isChatRoomsDataReady) return <Loading />;

  if (!chatRoomsData || chatRoomsData.length < 1) return <EmptyPage text="Daftar chat masih kosong..." />;

  return (
    <>
      {chatRoomsData.map((data) => (
        <div key={data.id}>
          <div className="flex items-center ml-3" onClick={() => push(`chat/${data.id}`)}>
            <div className="avatar w-[20%] lg:ml-3 lg:w-[10%]">
              <div className="rounded-full w-14">
                <img src={data.profilePicture} />
              </div>
            </div>

            <div className="w-[70%] -ml-2  lg:-ml-12 lg:w-[80%]">
              <p className="text-xl font-bold ">{data.username}</p>
              <p>{trimLongMessage(data.latestMsg)}</p>
            </div>

            <div className={data.unreadMsg < 1 ? "" : "w-5 h-5 p-4 flex items-center justify-center bg-accent rounded-full lg:ml-24"}>
              <p className="text-base-100">{data.unreadMsg < 1 ? "" : data.unreadMsg}</p>
            </div>
          </div>
          <div className="divider"></div>
        </div>
      ))}
    </>
  );
};

export default Chat;
