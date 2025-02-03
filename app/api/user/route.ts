import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("discord_user");

    if (!userCookie) return NextResponse.json({});

    const user = JSON.parse(userCookie.value);

    if (!user || !user.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const res = await fetch(
      `${process.env.FILE_SERVER_URI}/api/user?userId=${user.id}`,
      { method: "GET" }
    );

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    console.error("Error getting user: ", error);

    return NextResponse.json({ error: "Failed to get user." }, { status: 500 });
  }
}
