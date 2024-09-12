"use client";

import { useEffect, useState } from "react";
import LeftMenu from "../../components/LeftMenu";
import RIghtMenu from "../../components/RIghtMenu";
import ProfilePageFeed from "../../components/ProfilePageFeed";
import { useParams } from "next/navigation";
import ProfilePageRight from "../../components/ProfilePageRIght";
import { ClipLoader } from "react-spinners";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/user/${id}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);

          if (response.ok) {
            const postsData = await response.json();
            setPostsData(postsData);
          } else {
            console.error("Failed to fetch posts");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchUser();
      fetchPosts();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={70} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!user) {
    return <div>Failed to load data</div>;
  }

  return (
    <div className="flex gap-6 pt-6 ">
      <div className="hidden xl:block w-[20%] ml-40">
        <LeftMenu />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%] relative">
        <div>
          <div>
            <img
              className="h-52 w-full object-cover"
              src={
                user.coverPhoto ||
                "https://images.rawpixel.com/image_social_landscape/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjU0NmJhdGNoMy1teW50LTM0LWJhZGdld2F0ZXJjb2xvcl8xLmpwZw.jpg"
              }
              alt="Cover"
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative -mt-12">
              <img
                className="w-24 h-24 object-cover rounded-full border-4 "
                src={
                  user.profilePhoto ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Profile"
              />
            </div>
            <div>
              <p className="text-2xl font-medium">{user.name}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col ml-5">
                <p className="flex justify-center font-semibold">
                  {postsData.length}
                </p>
                <p className="text-sm">Posts</p>
              </div>
              <div className="flex flex-col">
                <p className="flex justify-center font-semibold">{user.follows.length}</p>
                <p className="text-sm"> Followers</p>
              </div>
              <div className="flex flex-col">
                <p className="flex justify-center font-semibold">{user.following.length}</p>
                <p className="text-sm">Following</p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <ProfilePageFeed userId={id} />
          </div>
        </div>
      </div>
      <div className="hidden lg:block  w-[40%] gap-3">
        <ProfilePageRight userId={id} />
        <RIghtMenu />
      </div>
    </div>
  );
};

export default ProfilePage;
