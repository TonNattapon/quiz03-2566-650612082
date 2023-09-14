import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Natthapon Chanaveroj",
    studentId: "650612082",
  });
};
