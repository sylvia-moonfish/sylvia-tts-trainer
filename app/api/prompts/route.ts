import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.FILE_SERVER_URI}/api/prompts`);

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    console.error("Error fetching prompts: ", error);

    return NextResponse.json(
      { error: "Failed to fetch prompts." },
      { status: 500 }
    );
  }
}
