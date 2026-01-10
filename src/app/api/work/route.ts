import { NextResponse } from "next/server";
import { workItems } from "@/data/work";

export async function GET() {
  // Simulate a bit of latency and backend caching
  return NextResponse.json(workItems, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
