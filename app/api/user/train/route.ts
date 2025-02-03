import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("discord_user");

    if (!userCookie)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const user = JSON.parse(userCookie.value);

    if (!user || !user.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const res = await fetch(
      `${process.env.FILE_SERVER_URI}/api/user/train?userId=${user.id}`,
      { method: "GET" }
    );

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    console.error("Error submitting for training: ", error);

    return NextResponse.json(
      { error: "Failed to submit for training." },
      { status: 500 }
    );
  }
}
