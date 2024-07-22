"use client";

export const getUserInfo = () => {
  if (typeof window !== "undefined") { // Check if running on the client side
    const authData = JSON.parse(localStorage.getItem("auth")) || {};

    const { uid, username, profilePicture, email, store } = authData;

    return { uid, username, profilePicture, email, store };
  }
  
  return {}; // Return an empty object if running on the server side
};
