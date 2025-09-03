import "dotenv/config";
import {createServer} from "http"
import { app } from "./app.js";
import connectDB from "./db/index.js";
import {Server} from "socket.io"
import { Clerk } from "@clerk/backend";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const PORT = process.env.PORT || 4000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    // Verify Clerk session token
    const sessionClaims = await clerk.verifyToken(token);

    // Attach user info to socket
    socket.user = sessionClaims;
    next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    next(new Error("Unauthorized"));
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`Registered user ${userId} -> socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) onlineUsers.delete(uid);
    }
    console.log("❌ Disconnected:", socket.id);
  });
});

// expose io + users for controllers
app.set("io", io);
app.set("ioUsers", onlineUsers);

app.get("/", (req, res) => {
  res.send("Kya be");
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => console.log("MONGO db connection failed !!! ", err));

export { io };
export default server;