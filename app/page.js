"use client";
import { useDispatch, useSelector } from "react-redux";
import AddPost from "./components/AddPost";
import Feed from "./components/Feed";
import LeftMenu from "./components/LeftMenu";
import RightMenu from "./components/RightMenu";
import Stories from "./components/Stories";
import { useEffect } from "react";
import { setUser } from "./features/UserSlice";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/current-user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        if (!userData || Object.keys(userData).length === 0) {
          throw new Error("User data not found");
        }

        dispatch(setUser(userData));
      } catch (error) {
        console.error("Error fetching user data:", error);

        toast.error("You need to login first");

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    };

    fetchUserData();
  }, [dispatch, router]);

  return (
    <div>
      <ToastContainer />
      <div className="flex gap-6 pt-6">
        <div className="hidden xl:block w-[20%] ml-28">
          <LeftMenu type="home" />
        </div>
        <div className="w-full lg:w-[30%] xl:w-[65%]">
          <div className="flex flex-col gap-6">
            <Stories />
            <AddPost />
            <Feed />
          </div>
        </div>
        <div className="hidden lg:block w-[30%]">
          <RightMenu />
        </div>
      </div>
    </div>
  );
};

export default Home;
