
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Get customer from Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      // No customer found, ensure free subscription exists
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan: "free",
        is_active: true,
        started_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        subscribed: false, 
        plan: "free",
        is_active: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let plan = "free";
    let expiresAt = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      plan = "pro";
      expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Update subscription in database
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan: "pro",
        is_active: true,
        started_at: new Date(subscription.created * 1000).toISOString(),
        expires_at: expiresAt,
        provider: "stripe",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
      }, { onConflict: 'user_id' });
    } else {
      // Update to free plan
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan: "free",
        is_active: true,
        started_at: new Date().toISOString(),
        expires_at: null,
        provider: null,
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
      }, { onConflict: 'user_id' });
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan: plan,
      is_active: true,
      expires_at: expiresAt
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
