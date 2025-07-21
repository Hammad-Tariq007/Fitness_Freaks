
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Require service role key in env
  const service_role = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!service_role) {
    return new Response(JSON.stringify({ error: "Missing service role key" }), {
      status: 500,
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let userId: string | undefined;
  try {
    const { user_id } = await req.json();
    if (!user_id) throw new Error("User_id is required");
    userId = user_id;
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }

  // Delete user from Supabase Auth
  const authRes = await fetch(
    `https://ksfctvcevtukczvfieoy.supabase.co/auth/v1/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        apiKey: service_role,
        Authorization: `Bearer ${service_role}`,
        "Content-Type": "application/json"
      },
    }
  );

  // Delete user profile from user_profiles (and maybe more)
  const dbRes = await fetch("https://ksfctvcevtukczvfieoy.supabase.co/rest/v1/user_profiles?user_id=eq." + userId, {
    method: "DELETE",
    headers: {
      apiKey: service_role,
      Authorization: `Bearer ${service_role}`,
      Prefer: "return=representation",
    },
  });

  if (!authRes.ok && !dbRes.ok) {
    const err1 = await authRes.text();
    const err2 = await dbRes.text();
    return new Response(
      JSON.stringify({ error: "Failed to delete user", details: { auth: err1, db: err2 } }),
      { status: 400 }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
