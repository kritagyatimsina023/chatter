import { create } from "zustand";
import { axiosInstances } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// this set is used to update the state

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isImageLoading: false,
  socket: null,
  onlineUsers: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstances.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in auth check", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      // console.log(data, "THis is user data  form");
      set({ isSignUp: true });
      const res = await axiosInstances.post("/auth/signup", data);
      toast.success("Account has been created");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isSignUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstances.post("/auth/login", data);
      toast.success(`${res.data.fullName} logged in`);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logOut: async () => {
    try {
      set({ isLoggingOut: true });
      await axiosInstances.post("/auth/logout");
      toast.success(`logged out`);
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (data) => {
    set({ isImageLoading: true });
    try {
      const res = await axiosInstances.put("/auth/update-profile", data);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ authUser: res.data });
      toast.success("Profile uploaded successfully");
    } catch (error) {
      console.log("Error uploading profile image", error);
      toast.error("Errro uploading profile pic");
    } finally {
      set({ isImageLoading: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // cookies are sent with the connection
    });
    socket.connect();
    set({ socket: socket });
    // socket.on("connect_error", (err) => {
    //   console.log("Socket connection error:", err.message);
    // });

    //listen onlineuser event
    socket.on("getonlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
