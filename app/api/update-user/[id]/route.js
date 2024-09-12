import { NextResponse } from "next/server";
import connect from "../../../../db";
import User from "../../../../models/User";

export const PUT = async (request, { params }) => {
  try {
    await connect();

    const userID = params.id;
    const formData = await request.json();

    if (!formData.password) {
      delete formData.password;
    }

    const user = await User.findByIdAndUpdate(userID, formData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
