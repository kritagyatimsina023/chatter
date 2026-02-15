import cloudinary from "../lib/cloudinary.js";
import Message from "../model/Message.js";
import User from "../model/User.js";
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // fetching all the contacts of the user except the current logged in user
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params; // other user id

    // me and you
    // me sending message to you
    // you sending message to me
    const message = await Message.find({
      $or: [
        { senderId: userToChatId, receiverId: myId },
        { senderId: myId, receiverId: userToChatId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getting messages", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message must contain text or image" });
    }

    if (senderId.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    let imgUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imgUrl,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
    // todo : implement real time functionalities - socket.io
  } catch (error) {
    console.log("Error in sending messages", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatsPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    // this new set automatically removes the duplicates
    const chatPartnersId = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];
    const chatPartners = await User.find({
      _id: { $in: chatPartnersId },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getting chat partners", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
