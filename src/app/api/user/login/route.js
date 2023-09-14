import jwt from "jsonwebtoken";

import { DB, readDB } from "@/app/libs/DB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;

  //you should do the validation here
  const user = DB.users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect",
      },
      { status: 400 }
    );
  }
  const token = jwt.sign(
    { username, password, role: user.role }, //paylode
    process.env.JWT_SECRET, //สร้าง
    { expiresIn: "8h" }
  );

  return NextResponse.json({ ok: true, token });
};
