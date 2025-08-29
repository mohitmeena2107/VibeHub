import React from "react";
import { Route, Routes } from "react-router-dom";
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

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

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
