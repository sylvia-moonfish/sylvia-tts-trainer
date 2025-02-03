import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();

    if (cookieStore.has("discord_user")) {
      cookieStore.delete("discord_user");
    }
  } catch (error) {
    console.error("Failed to logout: ", error);
  } finally {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
