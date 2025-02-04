import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    return await fetch(
      `${process.env.FILE_SERVER_URI}/${(await params).path.join("/")}`,
      { cache: "no-store" }
    );
  } catch (error) {
    console.error("Error relaying static file: ", error);

    return NextResponse.json(
      { error: "Error relaying static file." },
      { status: 500 }
    );
  }
}
