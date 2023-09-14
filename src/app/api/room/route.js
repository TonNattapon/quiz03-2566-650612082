import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { Fontdiner_Swanky } from "next/font/google";
import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import { headers } from "next/headers";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  let totalRooms = Object.keys(rooms).length;
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  readDB();
  const rawAuthHeader = headers().get("authorization");
  const token = rawAuthHeader.split(" ")[1];

  let role = null;

  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET);
    role = payload.role;
  } catch (error) {
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

  const body = await request.json();
  const { roomName } = body;

  const foundRoom = DB.rooms.find((room) => room.roomName === roomName);
  if (foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  DB.rooms.push({
    roomName,
    roomId,
  });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
