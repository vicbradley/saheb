"use client";
import { getUserInfo } from "@/app/logic/getUserInfo";
import EditProfile from "./EditProfile";
import { useAuthContext } from "@/app/context/Auth";
import { useEffect } from "react";

const Profile = ({params}) => {
  const {uid, username, profilePicture, email} = getUserInfo();
  const {isLocalStorageUpdated} = useAuthContext();

  useEffect(() => {
    // jika localstorage diupdate, ambil ulang data dari localstorage
    return;
  },[isLocalStorageUpdated])

  if (uid !== params.id) return <h1>Error: Id tidak sesuai</h1>

  return (
    <div className="w-[90%] max-w-sm m-auto mt-8 bg-white border border-gray-200 rounded-lg shadow p-4">
      <div className="flex justify-end px-4 pt-4">
       
      </div>
      <div className="flex flex-col items-center pb-10">
        <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" src={profilePicture} alt={username} />
        <h5 className="mb-1 text-xl font-medium text-gray-900 ">{username}</h5>
        <span className="text-sm text-gray-500 ">{email}</span>
        <div className="flex mt-4 md:mt-6">
            <EditProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;
