import { create } from "zustand";
import { axiosInstances } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); // updating the local storage
    set({ isSoundEnabled: !get().isSoundEnabled }); // now updating the ui
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstances.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstances.get("/messages/chats");
      console.log("This is chat response", res.data);
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstances.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    // if (!selectedUser || selectedUser._id === authUser._id) {
    //   toast.error("Invalid recipient");
    //   return;
    // }
    const tempId = `temp-${Date.now()}`;

    const optimisticMsg = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    // immediately update the ui after adding the message
    set({ messages: [...messages, optimisticMsg] });

    try {
      const res = await axiosInstances.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      // set({ messages: messages.concat(res.data) });
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg,
        ),
      }));
    } catch (error) {
      // remove the optimistic msg on failure
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "somthing went wrong");
    }
  },
  subscribeToMsg: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      //Always read FRESH selectedUser from store, not closure
      const currentSelectedUser = get().selectedUser;

      //  Only add message if it's from the currently open chat
      if (newMessage.senderId !== currentSelectedUser?._id) return;

      const { isSoundEnabled } = get();
      set({ messages: [...get().messages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sound/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed", e));
      }
    });
  },

  // subscribeToMsg: () => {
  //   const { selectedUser, isSoundEnabled } = get();
  //   if (!selectedUser) return;
  //   const socket = useAuthStore.getState().socket;

  //   socket.on("newMessage", (newMessage) => {
  //     const currentMsg = get().messages;
  //     set({ messages: [...currentMsg, newMessage] });
  //     if (isSoundEnabled) {
  //       const notificationSound = new Audio("/sound/notification.mp3");
  //       notificationSound.currentTime = 0; // reset to start
  //       notificationSound
  //         .play()
  //         .catch((e) => console.log("Audio play failed", e));
  //     }
  //   });
  // },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
