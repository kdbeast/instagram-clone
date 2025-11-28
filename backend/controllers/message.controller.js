// for chatting
import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      const newConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    if (newMessage) await conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(200).json({ newMessage, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation)
      return res.status(404).json({ messages: "Conversation not found" });

    res.status(200).json({ conversation, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
