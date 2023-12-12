"use client";

export const getUserInfo = () => {
  // const check = typeof window !== "undefined" ? window.localStorage.getItem('auth') : false;

  // console.log(check);

  const authData = JSON.parse(localStorage.getItem("auth")) || {};

  const { uid, username, profilePicture, email, store } = authData;

  return { uid, username, profilePicture, email, store };
}