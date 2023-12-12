"use client";
// react
import { useEffect, useState } from "react";
// next
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
// firebase config
import { auth } from "@/src/firebase/config";
// logic
import { getUserInfo } from "../logic/getUserInfo";
// context
import { useAuthContext } from "../context/Auth";
// firebase
import { signOut } from "firebase/auth";
// auth
import { signInWithGoogle } from "../auth/signInWithGoogle";
// components
import SignInPopUp from "./SignInPopUp";
import CartIcon from "../cart/CartIcon";
import { Button } from "@chakra-ui/react";
import ChatIcon from "@/app/chat/ChatIcon";

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [uid, setUID] = useState(null);
  const { isAuth, setIsAuth, isLocalStorageUpdated } = useAuthContext();
  const [storeName, setStoreName] = useState(null);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuth) {
      setProfile("Sign In");
      setPhotoURL("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
    } else {
      const { uid, username, profilePicture } = getUserInfo();
      if ("store" in getUserInfo()) {
        setStoreName(getUserInfo().store);
      }
      setUID(uid);
      setProfile(username);
      setPhotoURL(profilePicture);
    }
  }, [isAuth, isLocalStorageUpdated]);

  const handleSignIn = async () => {
    (await signInWithGoogle()) ? setIsAuth(true) : setIsAuth(false);
  };

  const handleStoreButton = () => {
    if (storeName) {
      const storeId = getUserInfo().store;
      push(`/${storeId}/dashboard`);
    } else {
      push("/store-register");
    }
  };

  const signOutFromGoogle = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      setIsAuth(false);
      push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const test = () => {
    console.log(regex.test(pathname));
  };

  const checkIfInChatRoom = () => {
    const regex = /^\/chat\/.*/;
    return regex.test(pathname);
  };

  if (checkIfInChatRoom()) {
    return null; // This will prevent rendering the entire Navbar component
  }

  return (
    <div className="navbar bg-[whitesmoke]">
      <div className="dropdown">
        {/* hamburger menu */}
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg xmlns="http:www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <Link href="/products">Products</Link>
          </li>

          <li>
            <Link href="/consult">Consult</Link>
          </li>

          <li>
            <a>About</a>
          </li>
        </ul>
      </div>

      {/* title */}
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost font-extrabold text-2xl text-[#001a9d]">
          Saheb
        </Link>
      </div>

      <div className="flex-none">
        {/* chat icon */}
        <div className="dropdown dropdown-end" onClick={() => push("/chat")}>
          <ChatIcon />
        </div>

        {/* cart icon */}
        <div className="dropdown dropdown-end">
          <CartIcon />
        </div>

        {/* profile picture */}
        <div className="dropdown dropdown-end">
          <div className="avatar" tabIndex={0}>
            <div className="rounded-full w-11">
              <img src={photoURL} alt="profile-picture" />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li className="mb-3">
              {isAuth ? (
                <Button _hover={{ bg: "baseBlue", color: "white" }}  color="baseBlue" onClick={() => push(`/profile/${uid}`)}>
                  {profile}
                </Button>
              ) : (
                <Button _hover={{ bg: "baseBlue", color: "white" }} color="baseBlue" onClick={handleSignIn}>
                  {profile}
                </Button>
              )}
            </li>
            <li className="mb-3">
              {isAuth && (
                <Button onClick={handleStoreButton} _hover={{ bg: "baseBlue", color: "white" }} color="baseBlue">
                  {storeName ? storeName : "Jadi Mitra Saheb"}
                </Button>
              )}
              {!isAuth && <SignInPopUp text="Jadi Mitra Saheb" />}
            </li>
            <li>
              <Button onClick={signOutFromGoogle} _hover={{ bg: "baseBlue", color: "white" }} color="baseBlue">
                Sign Out
              </Button>
              {/* <a onClick={signOutFromGoogle}>Sign Out</a> */}
            </li>
            <li>
              <a onClick={test}>Test</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
