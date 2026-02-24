import { create } from "zustand";
import { axiosInstances } from "../lib/axios.js";
import toast from "react-hot-toast";

// this set is used to update the state
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstances.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in auth check", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      console.log(data, "THis is user data  form");
      set({ isSignUp: true });
      const res = await axiosInstances.post("/auth/signup", data);
      toast.success("Account has been created");
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isSignUp: false });
    }
  },
}));
