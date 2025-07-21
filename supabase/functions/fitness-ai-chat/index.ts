
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FITNESS-AI-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleApiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not set");
    }
    logStep("Google AI API key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Check if user has premium access
    const { data: hasAccess, error: accessError } = await supabaseClient
      .rpc('has_premium_access', { check_user_id: user.id });
    
    if (accessError) throw new Error(`Access check error: ${accessError.message}`);
    if (!hasAccess) {
      throw new Error("Premium subscription required for AI features");
    }
    logStep("Premium access verified");

    const { message, conversationHistory = [] } = await req.json();
    if (!message || typeof message !== 'string') {
      throw new Error("Message is required and must be a string");
    }
    logStep("Request data validated", { message: message.substring(0, 50) + "..." });

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history for Gemini
    const history = conversationHistory.slice(-10).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Fitness-focused system prompt
    const systemPrompt = `You are a professional fitness coach and nutritionist AI assistant. You provide expert advice on:
- Workout routines and exercise techniques
- Nutrition plans and meal suggestions
- Diet recommendations for different fitness goals
- Recovery and wellness tips
- Injury prevention and rehabilitation guidance

Keep responses concise, practical, and actionable. Always prioritize safety and recommend consulting healthcare professionals for medical concerns.`;

    logStep("Making request to Gemini API");

    try {
      const chat = model.startChat({
        history: history,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(`${systemPrompt}\n\nUser question: ${message}`);
      const aiResponse = result.response.text();

      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }

      logStep("Gemini API response received", { responseLength: aiResponse.length });

      return new Response(JSON.stringify({ 
        message: aiResponse.trim(),
        success: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (geminiError: any) {
      logStep("Gemini API error", { error: geminiError.message });
      
      // Provide a helpful fallback response
      const fallbackResponse = "I'm here to help with your fitness and nutrition questions! Could you please rephrase your question or be more specific about what you'd like to know?";
      
      return new Response(JSON.stringify({ 
        message: fallbackResponse,
        success: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in fitness-ai-chat", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
