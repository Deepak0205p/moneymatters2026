import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendResponse = await fetch("http://127.0.0.1:8001/api/health", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { status: "unhealthy", detail: `Backend returned ${backendResponse.status}` },
        { status: 503 }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { status: "unhealthy", detail: "Backend service is not reachable" },
      { status: 503 }
    );
  }
}
