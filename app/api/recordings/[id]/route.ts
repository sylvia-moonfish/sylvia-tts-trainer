import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const promptId = (await params).id;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("discord_user");

    if (!userCookie)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const user = JSON.parse(userCookie.value);

    if (!user || !user.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const res = await fetch(
      `${process.env.FILE_SERVER_URI}/api/recordings/${promptId}?userId=${user.id}`,
      { method: "DELETE" }
    );

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    console.error("Error deleting recording: ", error);

    return NextResponse.json(
      { error: "Failed to delete recording." },
      { status: 500 }
    );
  }
}
