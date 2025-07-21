
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bmi, goal, age, gender } = await req.json();

    const prompt = `Based on the following user profile, recommend 1-2 suitable nutrition goals from these options: "Weight Loss", "Muscle Gain", "Maintenance".

User Profile:
- BMI: ${bmi}
- Fitness Goal: ${goal}
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}

BMI Categories:
- Underweight: < 18.5
- Normal weight: 18.5-24.9
- Overweight: 25-29.9
- Obese: ≥ 30

Please respond with only the recommended nutrition goals (comma-separated if multiple) and a brief 1-sentence explanation. Format: "Goal1, Goal2|Explanation"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a nutrition expert providing personalized diet recommendations.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;
    
    const [goals, explanation] = result.split('|');
    const recommendedGoals = goals.split(',').map((g: string) => g.trim());

    return new Response(JSON.stringify({ 
      recommendedGoals,
      explanation: explanation?.trim() || 'Personalized recommendations based on your profile.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nutrition-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
