import { NextResponse } from "next/server";
import { createConversation, getRecentMessages, addMessage } from "@/lib/chatStore";

export async function POST(request) {
  try {
    const body = await request.json();
    let { message, conversationId } = body;

    // Create a new conversation if one doesn't exist
    if (!conversationId) {
      const conv = await createConversation(message.substring(0, 50));
      if (conv) conversationId = conv.id;
    }

    // Load history
    let history = [];
    if (conversationId) {
      history = await getRecentMessages(conversationId, 10);
    }

    // Save user message
    if (conversationId) {
      await addMessage(conversationId, "user", message);
    }

    // Proxy to backend stream endpoint
    const backendUrl = process.env.CHATBOT_BACKEND_URL || 'http://127.0.0.1:8001';
    const backendResponse = await fetch(`${backendUrl}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, conversation_id: conversationId, history }),
      signal: AbortSignal.timeout(60000),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Backend returned ${backendResponse.status}: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    // Intercept stream to save assistant message while streaming to client
    const reader = backendResponse.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let assistantContent = "";
        let route = null;
        let latency = null;
        let sources = null;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);

            // parse value to save to db
            const text = decoder.decode(value, { stream: true });
            const events = text.split("\n\n");
            for (const ev of events) {
              if (ev.startsWith("data: ")) {
                try {
                  const data = JSON.parse(ev.slice(6));
                  if (data.type === 'metadata') {
                    route = data.route;
                    sources = data.sources;
                  } else if (data.type === 'chunk') {
                    assistantContent += data.content;
                  } else if (data.type === 'done') {
                    latency = data.latency_ms;
                  }
                } catch (e) {
                  // ignore JSON parse errors on partial chunks
                }
              }
            }
          }
        } finally {
          controller.close();

          // Save assistant message to DB
          if (conversationId && assistantContent) {
            await addMessage(conversationId, "assistant", assistantContent, {
              route,
              latency_ms: latency,
              sources
            });
          }
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Conversation-Id": conversationId || ""
      }
    });

  } catch (error) {
    console.error("Chatbot API proxy error:", error);

    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Backend timed out. Please try again, bhai." },
        { status: 504 }
      );
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Can't reach the backend service. Please make sure it's running." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Oops, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
