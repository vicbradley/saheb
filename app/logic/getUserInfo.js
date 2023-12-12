"use client";

export const getUserInfo = () => {
  const authData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth")) : {};

  // console.log(check);

  // const authData = JSON.parse(localStorage.getItem("auth")) || {};

  const { uid, username, profilePicture, email, store } = authData;

  return { uid, username, profilePicture, email, store };
}