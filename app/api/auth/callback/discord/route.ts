import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const redirectUrl = new URL("/", request.url);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(redirectUrl);

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    });

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (userData.id) {
      const formData = new FormData();

      formData.append("userId", userData.id);
      formData.append("username", userData.username);

      const res = await fetch(`${process.env.FILE_SERVER_URI}/api/user`, {
        body: formData,
        method: "POST",
      });

      if (res.ok) {
        const user = await res.json();

        if (!user.error && user.id) {
          (await cookies()).set("discord_user", JSON.stringify(user), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
      }
    }
  } catch (error) {
    console.error("Auth callback discord error: ", error);
  } finally {
    return NextResponse.redirect(redirectUrl);
  }
}
