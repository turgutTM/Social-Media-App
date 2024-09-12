import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    setPost: (state, action) => {
      state.posts = action.payload;
    },
    deletePost: (state, action) => {
      const itemId = action.payload;
      state.posts = state.posts.filter((post) => post._id !== itemId);
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex((post) => post._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
  },
});

export const { addPost, setPost, deletePost, updatePost } = postSlice.actions;

export const selectPostsByUserID = (state, userID) =>
  state.posts.posts.filter((post) => post.userID === userID);

export default postSlice.reducer;
