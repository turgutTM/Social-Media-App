import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";
import { sendVerificationEmail } from "../../utils/sendEmail";

export const POST = async (request) => {
  try {
    await connect();

    const { email, surname, name, password } = await request.json();

    console.log("Received data:", { email, surname, name, password });

    if (!email || !name || !password || !surname) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 }
      );
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      email,
      name,
      password,
      surname,
      verificationCode,
      isVerified: false,
    });

    await newUser.save();

    await sendVerificationEmail(verificationCode);

    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error in registration:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
