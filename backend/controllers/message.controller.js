// for chatting
import { Message } from "../model/message.model.js";
import { Conversation } from "../model/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ newMessage, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
