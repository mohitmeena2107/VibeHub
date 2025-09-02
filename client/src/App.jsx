import React, { useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import CreatePost from "./pages/CreatePost";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import { useAuth, useUser } from "@clerk/clerk-react";
import Layout from "./pages/Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/users/userSlice";
import { fetchConnections } from "./features/connections/connectionsSlice";
import { addMessage } from "./features/messages/messagesSlice";
import socket from "../socket";


const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const {pathname}  = useLocation()
  const dispatch = useDispatch();
  const pathref = useRef(pathname);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  useEffect(() => {
    pathref.current = pathname;
  }, [pathname]);


useEffect(() => {
  if (user) {
    // register user when logged in
    socket.emit("register", user.id);

    socket.on("receiveMessage", (message) => {
      if (
        pathref.current === "/messages/" + message.from_user_id._id ||
        pathref.current === "/messages/" + message.to_user_id
      ) {
        dispatch(addMessage(message)); // update Redux in real-time
      } else {
        // show notification if needed
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }
}, [user, dispatch]);



  return (
    <>

      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
        </Route>
      </Routes>

    </>
  );
};

export default App;
