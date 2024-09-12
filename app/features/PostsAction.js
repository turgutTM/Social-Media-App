import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

const getAllPosts = async () => {
  const { data } = await axios.get(`${BASE_URL}/posts`);
  console.log(data);
  return data;
};

const createPost = async (post) => {
  console.log(post);
  await axios.post(`${BASE_URL}/create-post`, post);
};

const deletePostAction = async (post) => {
  await axios.delete(`${BASE_URL}/delete-post/${post._id}`);
};

const updatePostAction = async (post) => {
  const { data } = await axios.patch(`${BASE_URL}/update-post/${post._id}`, post);
  return data;
};

export { getAllPosts, createPost, deletePostAction, updatePostAction };
