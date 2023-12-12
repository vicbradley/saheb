export const getUserInfo = () => {
  const authData = JSON.parse(localStorage.getItem("auth")) || {};

  const { uid, username, profilePicture, email, store } = authData;

  return { uid, username, profilePicture, email, store };
}