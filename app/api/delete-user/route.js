import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";

export const DELETE = async (request, { params }) => {
  const { id } = params;
  try {
    await connect();
    await User.findByIdAndDelete(id);
    return new NextResponse("User deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error deleting user", { status: 500 });
  }
};
