// /app/api/auth/login.ts
import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = createSupabaseReqRes();

  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  return new Response(JSON.stringify({ user }), { status: 200 });
}
