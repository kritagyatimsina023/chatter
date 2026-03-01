import React, { useRef } from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  LucideLoader2,
} from "lucide-react";
const mouseClickSound = new Audio("/sound/mouse-click.mp3");

const ProfileHeader = () => {
  const { authUser, logOut, updateProfile, isImageLoading } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
      await updateProfile({ profilePic: base64Img });
    };
  };
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* avatar  */}
          <div className="avatar online">
            <button
              onClick={() => fileInputRef.current.click()}
              className="size-14 rounded-full flex items-center justify-center overflow-hidden 
              relative group"
            >
              {isImageLoading ? (
                <LucideLoader2 className="animate-spin" />
              ) : (
                <img
                  src={authUser.profilePic || "avatar.png"}
                  alt="user image"
                  className="size-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {/* username and online text  */}
          </div>
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
          {/* buttons  */}
        </div>
        <div className="flex gap-4 items-center">
          {/* logout btn  */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logOut}
          >
            <LogOutIcon className="size-5" />
          </button>
          {/* sound btn  */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
