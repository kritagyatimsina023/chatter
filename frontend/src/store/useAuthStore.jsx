import { create } from "zustand";

// this set is used to update the state
export const useAuthStore = create((set) => ({
  authUser: { name: "Josh", _id: 123, age: 25 },
  isLoggedIn: false,
  isLoading: false,
  login: () => {
    console.log("We just logged in");
    set({ isLoggedIn: true, isLoading: true });
  },
}));
