
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  userId: string;
}

async function sendEmailWithResend(to: string, subject: string, htmlContent: string) {
  try {
    console.log(`Attempting to send welcome email to: ${to}`);
    
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FitnessFreaks <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Resend API error for ${to}:`, response.status, errorData);
      throw new Error(`Failed to send email: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log(`Welcome email sent successfully to ${to}:`, result);
    return { success: true, data: result };

  } catch (error) {
    console.error(`Failed to send welcome email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, userId }: WelcomeEmailRequest = await req.json();

    console.log("Processing welcome email for new user:", email);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const userName = name || profile?.name || 'Fitness Enthusiast';
    const userGoal = profile?.goal || 'fitness transformation';

    // Create personalized welcome email
    const welcomeEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
          <div style="display: inline-block; width: 56px; height: 56px; background: white; border-radius: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 28px;">🏋️</div>
          </div>
          <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.02em;">
            🏋️ Welcome to FitnessFreaks!
          </h1>
          <p style="color: #e5e5e5; margin: 16px 0 0 0; font-size: 20px; font-weight: 400;">
            Hi ${userName}, your transformation begins now! 💪
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 26px; font-weight: 600;">
              Your account is ready! 🎉
            </h2>
            <p style="color: #666; line-height: 1.6; margin: 0; font-size: 16px;">
              Welcome to the most advanced AI-powered fitness platform. We're excited to help you achieve your ${userGoal} goals with personalized workouts, nutrition plans, and expert guidance.
            </p>
          </div>
          
          <!-- Quick Start Guide -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%); padding: 32px 24px; border-radius: 16px; margin: 32px 0;">
            <h3 style="color: #1a1a1a; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; text-align: center;">
              🚀 Get Started in 3 Easy Steps
            </h3>
            <div style="display: grid; gap: 20px;">
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;">1</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 6px; font-size: 16px;">Complete Your Profile</div>
                  <div style="color: #666; font-size: 14px; line-height: 1.5;">Update your fitness goals, preferences, and current stats for personalized recommendations</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;">2</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 6px; font-size: 16px;">Explore AI-Generated Workouts</div>
                  <div style="color: #666; font-size: 14px; line-height: 1.5;">Browse our extensive library of workouts tailored to your fitness level and goals</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="width: 32px; height: 32px; background: #1a1a1a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;">3</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 6px; font-size: 16px;">Start Your First Workout</div>
                  <div style="color: #666; font-size: 14px; line-height: 1.5;">Begin with a beginner-friendly routine and track your progress in real-time</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Features Highlight -->
          <div style="margin: 40px 0;">
            <h3 style="color: #1a1a1a; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; text-align: center;">
              🎯 Premium Features Available to You
            </h3>
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                <div style="font-size: 20px; margin-top: 2px;">🤖</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">AI Fitness Coach</div>
                  <div style="color: #666; font-size: 14px;">Get personalized advice and answers to your fitness questions 24/7</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                <div style="font-size: 20px; margin-top: 2px;">📊</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Progress Dashboard</div>
                  <div style="color: #666; font-size: 14px;">Track your workouts, nutrition, and body measurements in one place</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                <div style="font-size: 20px; margin-top: 2px;">👥</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Community Forum</div>
                  <div style="color: #666; font-size: 14px;">Connect with fellow fitness enthusiasts and share your journey</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                <div style="font-size: 20px; margin-top: 2px;">🥗</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Nutrition Plans</div>
                  <div style="color: #666; font-size: 14px;">Custom meal plans designed to complement your fitness goals</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://fitnessfreaks.com/dashboard" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 0 8px 12px 8px;">
              🏋️ Explore Dashboard
            </a>
            <br>
            <a href="https://fitnessfreaks.com/workouts" 
               style="display: inline-block; background: transparent; color: #1a1a1a; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; border: 2px solid #1a1a1a; margin: 0 8px;">
              Browse Workouts →
            </a>
          </div>
          
          <!-- Success Stories -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 24px; border-radius: 16px; text-align: center; margin: 40px 0; color: white;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
              🌟 Join Successful Members
            </h3>
            <div style="margin: 20px 0;">
              <div style="font-size: 48px; font-weight: 700; margin-bottom: 8px;">15,000+</div>
              <div style="color: #e5e5e5; font-size: 16px;">Active Users Transforming Daily</div>
            </div>
            <div style="display: flex; justify-content: center; gap: 32px; margin: 24px 0; flex-wrap: wrap;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #4ade80;">85%</div>
                <div style="color: #e5e5e5; font-size: 12px;">Reach Their Goals</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #60a5fa;">4.9★</div>
                <div style="color: #e5e5e5; font-size: 12px;">User Rating</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #f59e0b;">12lbs</div>
                <div style="color: #e5e5e5; font-size: 12px;">Avg Weight Loss</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #1a1a1a; padding: 40px 30px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <div style="display: inline-block; width: 40px; height: 40px; background: white; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 20px;">🏋️</div>
            </div>
            <div style="color: white; font-weight: 700; font-size: 20px; margin-bottom: 8px;">FitnessFreaks</div>
            <div style="color: #999; font-size: 14px;">Your AI-Powered Fitness Companion</div>
          </div>
          
          <div style="color: #666; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
            <div style="margin-bottom: 12px;">
              💪 Ready to transform your life? Your journey starts now!<br>
              <strong style="color: #e5e5e5;">The FitnessFreaks Team</strong>
            </div>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 20px;">
            <div style="color: #666; font-size: 11px; margin-bottom: 12px;">
              Need help? Contact us anytime at <a href="mailto:support@fitnessfreaks.com" style="color: #999;">support@fitnessfreaks.com</a>
            </div>
            <div style="color: #666; font-size: 11px;">
              <a href="https://fitnessfreaks.com/privacy" style="color: #999; text-decoration: none;">Privacy Policy</a> | 
              <a href="https://fitnessfreaks.com/terms" style="color: #999; text-decoration: none;">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const welcomeEmailResult = await sendEmailWithResend(
      email,
      "🏋️ Welcome to FitnessFreaks!",
      welcomeEmailHtml
    );

    console.log("User welcome email result:", welcomeEmailResult);

    // Send notification to admin
    const adminEmail = "fitnessfreaks4youh@gmail.com";
    const adminNotificationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: #1a1a1a; color: white; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="font-size: 24px;">🎉</div>
            <h2 style="margin: 0; color: #fff; font-size: 20px; font-weight: 600;">New User Signup!</h2>
          </div>
        </div>
        
        <div style="background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; margin-bottom: 16px;">
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">NEW USER</div>
            <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${userName} (${email})</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">GOAL</div>
            <div style="color: #1a1a1a; font-size: 14px;">${userGoal}</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">SIGNUP TIME</div>
            <div style="color: #1a1a1a; font-size: 14px;">${new Date().toLocaleString()}</div>
          </div>
          
          <div style="padding: 16px; background: ${welcomeEmailResult.success ? '#f0f9f0' : '#fff5f5'}; border-radius: 8px; border-left: 4px solid ${welcomeEmailResult.success ? '#22c55e' : '#ef4444'};">
            <div style="color: ${welcomeEmailResult.success ? '#166534' : '#dc2626'}; font-size: 14px; font-weight: 500; margin-bottom: 4px;">
              Welcome Email Status
            </div>
            <div style="color: ${welcomeEmailResult.success ? '#15803d' : '#dc2626'}; font-size: 13px;">
              ${welcomeEmailResult.success ? '✅ Delivered successfully' : '❌ Delivery failed'}
            </div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
            🏋️ Another fitness enthusiast has joined FitnessFreaks!
          </div>
          <div style="color: #999; font-size: 12px;">
            User acquisition is growing strong 💪
          </div>
        </div>
      </div>
    `;

    const adminEmailResult = await sendEmailWithResend(
      adminEmail,
      "🚨 New User Signup - FitnessFreaks",
      adminNotificationHtml
    );

    console.log("Admin notification result:", adminEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully!",
        welcomeEmail: welcomeEmailResult,
        adminEmail: adminEmailResult,
        emailSentToUser: welcomeEmailResult.success
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send welcome email"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
