"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/UserSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = () => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loadingToastId, setLoadingToastId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = toast.loading("Logging in, please wait...");
    setLoadingToastId(id);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/login",
        values
      );

      dispatch(setUser(data));
      localStorage.setItem("token", data.token);

      toast.update(id, {
        render: "Logged in successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      setTimeout(() => {
        router.push("/");
      }, 4000);
    } catch (error) {
      console.error("Error logging in:", error);

      if (
        error.response &&
        error.response.data.message === "Invalid email or password"
      ) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }

      toast.update(loadingToastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoadingToastId(null);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex  items-center justify-center h-screen">
      <div className="flex bg-white justify-center items-center w-8/12 h-5/6 rounded-lg">
        <div className="relative h-full w-full bg-custom-gradient bg-cover bg-center rounded-l-lg">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm p-9 rounded-l-lg flex flex-col gap-16 justify-center items-center">
            <div className="font-extralight text-4xl text-white mb-4">TUGU</div>
            <div className="text-center flex flex-col gap-3">
              <div className="text-white font-semibold text-3xl">
                Hey, It's good to see you again
              </div>
              <div className="text-white font-thin">
                Sign in and keep surfing
              </div>
            </div>
            <div className="mt-4">
              <Link href="https://github.com/">
                <p className="text-blue-400">github.com</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full w-3/5 p-16 gap-16 bg-white bg-opacity-90 justify-between rounded-r-lg">
          <div>
            <h1 className="font-bold text-4xl text-black">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none placeholder-gray-400"
                name="email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none placeholder-gray-400"
                name="password"
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={onChange}
                required
              />
            </div>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            <button
              type="submit"
              className="bg-blue-500 text-white font-medium w-full rounded-full p-3"
            >
              CONTINUE
            </button>
          </form>
          <div className="flex justify-center text-blue-600">
            <Link href="/register">
              <p>Not a member yet?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
