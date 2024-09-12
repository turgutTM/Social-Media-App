"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        formData
      );
      console.log("User registered:", response.data);

      setFormData({
        email: "",
        name: "",
        surname: "",
        password: "",
        confirmPassword: "",
      });

      window.location.href = `/verify-email`;
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex bg-white justify-center items-center w-8/12 h-5/6 rounded-lg"
      >
        <div className="relative h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 bg-cover bg-center rounded-l-lg">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm p-9 rounded-l-lg flex flex-col gap-16 justify-center items-center">
            <div className="font-extralight text-4xl text-white mb-4">TUGU</div>
            <div className="text-center flex flex-col gap-3 text-white">
              <div className="font-semibold text-3xl">Welcome Page</div>
              <div className="font-thin">Sign up to continue access</div>
            </div>
            <div className="mt-4">
              <Link href="https://github.com/">
                <p className="text-blue-400">github.com</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full w-3/5 p-16 gap-16 bg-white bg-opacity-90 rounded-r-lg">
          <h1 className="font-bold text-4xl text-black">Sign Up</h1>
          <div className="flex flex-col gap-10">
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none w-full placeholder-gray-400"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none w-full placeholder-gray-400"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none w-full placeholder-gray-400"
                placeholder="Surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none w-full placeholder-gray-400"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border-b-2 border-gray-600 focus-within:border-b-blue-400 transition duration-300 ease-in-out">
              <input
                className="focus:outline-none w-full placeholder-gray-400"
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-medium w-full rounded-full p-3"
            >
              CONTINUE
            </button>
            <div className="flex justify-center text-sm mt-3">
              <Link href="/login">
                <p className="text-blue-600 ">Already a member?</p>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
