import React from "react";

const keyBoardSound = [
  new Audio("/sound/keystroke1.mp3"),
  new Audio("/sound/keystroke2.mp3"),
  new Audio("/sound/keystroke3.mp3"),
  new Audio("/sound/keystroke4.mp3"),
];

const useKeyBoardSound = () => {
  const playRandomKeyStrokeSound = () => {
    const randomSound =
      keyBoardSound[Math.floor(Math.random() * keyBoardSound.length)];

    randomSound.currentTime = 0;
    randomSound
      .play()
      .catch((error) => console.log("Audio failed to play", error));
  };

  return { playRandomKeyStrokeSound };
};

export default useKeyBoardSound;
