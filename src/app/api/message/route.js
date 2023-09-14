import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const room = DB.messages.filter((room) => room.roomId === roomId);
  if (room.length <= 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  return NextResponse.json(
    {
      ok: true,
      message: room,
    },
    { status: 404 }
  );
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body;
  const room = DB.messages.filter((room) => room.roomId === roomId);
  if (room.length <= 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({ roomId, messageId, messageText });
  writeDB();
  return NextResponse.json({
    ok: true,
    // messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();
  console.log(payload);
  const role = payload.role;

  if (role !== "SUPER_ADMIN") {
    // fix this Code
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
  const message = DB.messages.find(
    (message) => message.messageId === messageId
  );
  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  DB.messages = DB.messages.filter((x) => x !== message);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
