import React from "react";
import { dummyUserData } from "../assets/assets";
import { UserPlus, MessageCircle, Plus, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { fetchUser } from "../features/users/userSlice.js";
import toast from "react-hot-toast";
import api from "../api/axios";


const UserCard = ({ user }) => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFollow = async () => {
    const token = await getToken();
    try {
      const { data } = await api.post(
        "/api/v1/user/follow",
        { id: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(data);
      if (data.success) {
        toast.success("Follow Request Sent.");
        dispatch(fetchUser(await getToken()));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleConnect = async () => {
    if (currentUser.connections.includes(user._id)) {
      return navigate("/messages/" + user._id);
    }
    try {
      const { data } = await api.post(
        "/api/v1/user/connect",
        { id: user._id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      console.log(data);
      if (data.success) {
        toast.success("Connect Request Sent.");
        dispatch(fetchUser(await getToken));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md"
    >
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className="mt-4 font-semibold">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <MapPin className="w-4 h-4" /> {user.location}
        </div>
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{user.followers.length}</span> Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />{" "}
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>

        {/* Connection Request Button / Message Button */}
        <button
          onClick={handleConnect}
          className="size-10 flex items-center justify-center text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-95 transition cursor-pointer group"
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
          ) : (
            <Plus className="w-5 h-5 group-hover:scale-105 transition" />
          )}
        </button>
      </div>
    </div>
  );
};
export default UserCard;
