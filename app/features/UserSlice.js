import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  darkMode: false,
  isPrivate: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isPrivate = action.payload.isPrivate || false;
      if (!state.user.friendRequests) {
        state.user.friendRequests = [];
      }
      if (!state.user.blockedUsers) {
        state.user.blockedUsers = [];
      }
      if (!state.user.friends) {
        state.user.friends = [];
      }
      if (!state.user.following) {
        state.user.following = [];
      }
    },
    logoutUser: (state) => {
      state.user = {};
      state.darkMode = false;
      state.isPrivate = false;
    },
    clearUser: (state) => {
      state.user = {};
      state.isPrivate = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (action.payload.isPrivate !== undefined) {
        state.isPrivate = action.payload.isPrivate;
      }
    },
    addFriendRequest: (state, action) => {
      if (!state.user.friendRequests) {
        state.user.friendRequests = [];
      }
      if (!state.user.friendRequests.includes(action.payload)) {
        state.user.friendRequests.push(action.payload);
      }
    },
    addBlockedUser: (state, action) => {
      const blockedUserId = action.payload;
      if (!state.user.blockedUsers) {
        state.user.blockedUsers = [];
      }
      if (!state.user.blockedUsers.includes(blockedUserId)) {
        state.user.blockedUsers.push(blockedUserId);
      }
    },
    acceptFriendRequest: (state, action) => {
      const { friendId } = action.payload;
      if (state.user.friendRequests) {
        state.user.friendRequests = state.user.friendRequests.filter(
          (request) => request !== friendId
        );
      }
      if (!state.user.friends) {
        state.user.friends = [];
      }
      if (!state.user.friends.includes(friendId)) {
        state.user.friends.push(friendId);
      }
    },
    removeFriend: (state, action) => {
      const friendId = action.payload;
      if (state.user.friends) {
        state.user.friends = state.user.friends.filter((id) => id !== friendId);
      }
    },
    rejectFriendRequest: (state, action) => {
      const { friendId } = action.payload;
      if (state.user.friendRequests) {
        state.user.friendRequests = state.user.friendRequests.filter(
          (request) => request !== friendId
        );
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleIsPrivate: (state) => {
      state.isPrivate = !state.isPrivate;
    },
    addFollowing: (state, action) => {
      const followId = action.payload;
      if (!state.user.following) {
        state.user.following = [];
      }
      if (!state.user.following.includes(followId)) {
        state.user.following.push(followId);
      }
    },
    removeFollowing: (state, action) => {
      const followId = action.payload;
      if (state.user.following) {
        state.user.following = state.user.following.filter(
          (id) => id !== followId
        );
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  updateUser,
  logoutUser,
  addFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  toggleDarkMode,
  setDarkMode,
  toggleIsPrivate,
  addBlockedUser,
  removeFriend,
  addFollowing,
  removeFollowing,
} = userSlice.actions;

export default userSlice.reducer;
