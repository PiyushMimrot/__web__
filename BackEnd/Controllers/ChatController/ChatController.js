import ChatM from "../../Model/Chat/Chat.Model.js";

const createChatMessage = async (senderId, recipientId, content) => {
    try {
      const chatMessage = new ChatM({
        sender: senderId,
        recipient: recipientId,
        content: content,
      });
      await chatMessage.save();
      res.status(201).json(chatMessage);
      return chatMessage;
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
}

const getChatMessages = async (senderId) => {
    try {
      const messages = await ChatM.find().sort('timestamp');
      return messages;
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteChatMessage = async (messageId) => {
    try {
      const deletedMessage = await ChatM.findByIdAndRemove(messageId);
      return deletedMessage;
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
  };

  
export { createChatMessage,getChatMessages,deleteChatMessage }
  
