import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { email, verificationCode } = await request.json();
    console.log("Received email:", email);
    console.log("Received verification code:", verificationCode);

    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    console.log("Database verification code:", user.verificationCode);

    if (user.verificationCode === Number(verificationCode)) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();

      return new NextResponse(
        JSON.stringify({ message: "Email verified successfully" }),
        { status: 200 }
      );
    } else {
      console.log("Verification code mismatch");
      return new NextResponse(
        JSON.stringify({ message: "Invalid verification code" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-email API:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
