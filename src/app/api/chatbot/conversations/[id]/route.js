import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const supabaseChat = supabase;

export async function GET(request, { params }) {
  if (!supabaseChat) {
    return NextResponse.json([]);
  }

  const { id } = await params;

  const { data, error } = await supabaseChat
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  if (!supabaseChat) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;

  const { error } = await supabaseChat
    .from("conversations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
