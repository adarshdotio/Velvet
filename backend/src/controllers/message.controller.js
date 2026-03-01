import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSidebar = async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
  
  res.status(200).json(filteredUsers);
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  
  const messages = await Messge.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId }
    ]
  });
  
  res.status(200).json(messages);
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  
  let imageUrl;
  if (image) {
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    imageUrl = uploadRes.secure_url;
  }
  
  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl
  });
  
  await newMessage.save();
  
  // TODO: Realtime functionality goes here => using socket.io
  
  res.status(201).json(newMessage);
  
};