import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Monsieur_La_Doulaise } from "next/font/google";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const DBroomId = DB.rooms.find((x) => x.roomId === roomId);
  if (!DBroomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    messages: DB.messages.filter((x) => x.roomId === roomId),
  });
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body;

  const DBroomId = DB.rooms.find((x) => x.roomId === roomId);
  if (!DBroomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  DB.messages.push({
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const rawAuthHeader = headers().get("authorization");
  const token = rawAuthHeader.split(" ")[1];
  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET);
    studentId = payload.studentId;
    role = payload.role;
  } catch (error) {
    console.err(error);
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  if (role != "ADMIN" || role != "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const body = await request.json();
  const { messageId } = body;

  const foundIndex = DB.messages.findIndex((x) => x.message === messageId);

  if (foundIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  DB.messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
