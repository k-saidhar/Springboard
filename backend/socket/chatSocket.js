const Chat = require("../models/Chat");
const Message = require("../models/Messages");

const socketHandler = (io) => {
  io.on("connection", (socket) => {

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("send_message", async (data) => {
      const { chatId, from, to, text } = data;

      try {

        const broadcastMessage = {
          chatId,
          from: { _id: from },
          to,
          text,
          time: new Date(),
        };

        socket.to(chatId).emit("receive_message", broadcastMessage);
        
      } catch (err) {
        console.error("Socket error:", err);
      }
    });
  });
};

module.exports = socketHandler;