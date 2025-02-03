import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("discord_user");

    if (!userCookie)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const user = JSON.parse(userCookie.value);

    if (!user || !user.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const formData = await request.formData();

    formData.append("userId", user.id);

    const res = await fetch(`${process.env.FILE_SERVER_URI}/api/recordings`, {
      body: formData,
      method: "POST",
    });

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    console.error("Error saving recording: ", error);

    return NextResponse.json(
      { error: "Failed to save recording." },
      { status: 500 }
    );
  }
}
