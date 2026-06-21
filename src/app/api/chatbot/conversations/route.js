import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const supabaseChat = supabase;

export async function GET() {
  if (!supabaseChat) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseChat
    .from("conversations")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    if (!supabaseChat) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { title } = await request.json().catch(() => ({ title: "New Conversation" }));
    const { data, error } = await supabaseChat
      .from("conversations")
      .insert([{ title: title || "New Conversation" }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
