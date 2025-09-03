import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  messages: [],
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ token, userId }) => {
    const { data } = await api.post(
      "/api/v1/message/get",
      { to_user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.success ? data : null;
  }
);

const normalizeMessage = (msg) => ({
  ...msg,
  from_user_id:
    typeof msg.from_user_id === "object" ? msg.from_user_id._id : msg.from_user_id,
  to_user_id:
    typeof msg.to_user_id === "object" ? msg.to_user_id._id : msg.to_user_id,
});

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload.map(normalizeMessage);
    },
    addMessage: (state, action) => {
      const normalized = normalizeMessage(action.payload);
      state.messages = [...state.messages, normalized];
    },
    recentMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload) {
        state.messages = action.payload.messages.map(normalizeMessage);
      }
    });
  },
});

export const { setMessages, addMessage, recentMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
