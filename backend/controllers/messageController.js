import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // Ensure both senderId and receiverId are provided
        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create and save new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Optionally, emit an event through socket.io here

        return res.status(201).json({ message: "Message sent successfully" });

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        // Ensure both senderId and receiverId are provided
        if (!senderId || !receiverId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Fetch conversation and populate messages
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        return res.status(200).json(conversation.messages);

    } catch (error) {
        console.error("Error retrieving messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
