import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  messages: [],
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ token, userId }) => {
    const { data } = await api.get('/api/v1/message/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { to_user_id: userId },
    });
    console.log(data);
    return data.success ? data : null;
  }
);


const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    recentMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload) {
        state.messages = action.payload.messages;
      }
    });
  },
});
export const { setMessages, addMessage, recentMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
