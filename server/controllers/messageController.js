import fs from "fs";
import imagekit from "../config/imagekit.js";
import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth; 
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (image) {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    const populated = await Message.findById(message._id).populate("from_user_id");

    // emit to both sender & receiver
    const io = req.app.get("io");
    const onlineUsers = req.app.get("ioUsers");

    const recipientSocket = onlineUsers.get(to_user_id);
    if (recipientSocket) io.to(recipientSocket).emit("receiveMessage", populated);

    const senderSocket = onlineUsers.get(userId);
    if (senderSocket) io.to(senderSocket).emit("receiveMessage", populated);

    res.json({ success: true, message: populated });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Get chat messages between two users
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ fixed
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ created_at: 1 }); // ✅ oldest first

    // mark as seen
    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get recent messages for logged-in user
export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth; 

    const messages = await Message.find({ to_user_id: userId })
      .populate("from_user_id to_user_id")
      .sort({ created_at: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
