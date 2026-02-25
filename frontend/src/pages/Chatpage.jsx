import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Chatpage = () => {
  const { authUser, isLoggedIn, login, logOut } = useAuthStore();

  return (
    <div className="relative z-10">
      <button onClick={logOut}> logout</button>
    </div>
  );
};

export default Chatpage;
