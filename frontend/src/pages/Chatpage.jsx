import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Chatpage = () => {
  const { authUser, isLoggedIn, login } = useAuthStore();

  return <div>Chatpage</div>;
};

export default Chatpage;
