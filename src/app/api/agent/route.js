import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/agent";

export async function POST(request) {
  try {
    const body = await request.json();

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          error: "Messages are required."
        },
        {
          status: 400
        }
      );
    }

    const result = await runAgent(messages);

    return NextResponse.json({
      response: result.response,
      events: result.events || [],
      decision: result.decision || null,
      refund: result.refund || null,
      mode: result.mode || "openai"
    });
  } catch (error) {
    console.error("Agent API error:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Unable to process the request."
      },
      {
        status: 500
      }
    );
  }
}