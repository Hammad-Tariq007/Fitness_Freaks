
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

async function sendEmailWithResend(to: string, subject: string, htmlContent: string) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    
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
    console.log(`Email sent successfully to ${to}:`, result);
    return { success: true, data: result };

  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    console.log("Processing newsletter subscription for:", email);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user is already subscribed
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing subscriber:", checkError);
      throw new Error("Failed to check subscription status");
    }

    if (existingSubscriber) {
      console.log("User already subscribed:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "You're already subscribed to the newsletter!",
          alreadySubscribed: true
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Add new subscriber to database
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (insertError) {
      console.error("Error inserting subscriber:", insertError);
      throw new Error("Failed to save subscription");
    }

    console.log("New subscriber added to database:", email);

    // Enhanced welcome email to subscriber
    const welcomeEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
          <div style="display: inline-block; width: 48px; height: 48px; background: white; border-radius: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 24px;">🏋️</div>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">
            🎉 Welcome to FitnessFreaks!
          </h1>
          <p style="color: #e5e5e5; margin: 12px 0 0 0; font-size: 18px; font-weight: 400;">
            Your fitness journey starts here
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; margin: 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
              Thanks for joining our community! 👋
            </h2>
            <p style="color: #666; line-height: 1.6; margin: 0; font-size: 16px;">
              You're now part of a growing family of fitness enthusiasts who are transforming their lives through AI-powered workouts and nutrition plans.
            </p>
          </div>
          
          <!-- Features Grid -->
          <div style="background: #f8f9fa; padding: 32px 24px; border-radius: 16px; margin: 32px 0;">
            <h3 style="color: #1a1a1a; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; text-align: center;">
              What's waiting for you:
            </h3>
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 18px; margin-top: 2px;">🏃‍♂️</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Personalized AI Workouts</div>
                  <div style="color: #666; font-size: 14px;">Custom training plans that adapt to your progress</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 18px; margin-top: 2px;">🥗</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Smart Nutrition Plans</div>
                  <div style="color: #666; font-size: 14px;">Meal plans tailored to your goals and preferences</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 18px; margin-top: 2px;">📊</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Progress Tracking</div>
                  <div style="color: #666; font-size: 14px;">Detailed analytics and insights on your journey</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 18px; margin-top: 2px;">💡</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Weekly Insights</div>
                  <div style="color: #666; font-size: 14px;">Expert tips and latest fitness trends</div>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 18px; margin-top: 2px;">👥</div>
                <div>
                  <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">Community Support</div>
                  <div style="color: #666; font-size: 14px;">Connect with like-minded fitness enthusiasts</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0 32px 0;">
            <a href="https://fitnessfreaks.com" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
              Start Your Journey →
            </a>
          </div>
          
          <!-- Social Proof -->
          <div style="background: linear-gradient(135deg, #f0f0f0 0%, #f8f9fa 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 32px 0;">
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
              🌟 Join thousands of users who've already transformed their fitness journey<br>
              <strong style="color: #1a1a1a;">Average weight loss: 15lbs in first 8 weeks</strong>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #1a1a1a; padding: 32px 30px; text-align: center;">
          <div style="margin-bottom: 16px;">
            <div style="display: inline-block; width: 32px; height: 32px; background: white; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 16px;">🏋️</div>
            </div>
            <div style="color: white; font-weight: 600; font-size: 18px; margin-bottom: 8px;">FitnessFreaks</div>
          </div>
          
          <div style="color: #999; font-size: 12px; line-height: 1.5; margin-bottom: 16px;">
            <div style="margin-bottom: 8px;">Stay strong, stay motivated! 💪</div>
            <div>The FitnessFreaks Team</div>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 16px;">
            <div style="color: #666; font-size: 11px; margin-bottom: 8px;">
              You're receiving this because you subscribed to our newsletter.
            </div>
            <div style="color: #666; font-size: 11px;">
              <a href="#" style="color: #999; text-decoration: none;">Unsubscribe</a> | 
              <a href="#" style="color: #999; text-decoration: none;">Manage Preferences</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const welcomeEmailResult = await sendEmailWithResend(
      email,
      "🎉 Welcome to the FitnessFreaks Newsletter!",
      welcomeEmailHtml
    );

    console.log("Welcome email result:", welcomeEmailResult);

    // Send notification email to admin
    const adminEmail = "fitnessfreaks4youh@gmail.com";
    const adminEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: #1a1a1a; color: white; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="font-size: 24px;">🎉</div>
            <h2 style="margin: 0; color: #fff; font-size: 20px; font-weight: 600;">New Newsletter Subscriber!</h2>
          </div>
        </div>
        
        <div style="background: white; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; margin-bottom: 16px;">
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">SUBSCRIBER DETAILS</div>
            <div style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${email}</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">TIMESTAMP</div>
            <div style="color: #1a1a1a; font-size: 14px;">${new Date().toLocaleString()}</div>
          </div>
          
          <div style="padding: 16px; background: ${welcomeEmailResult.success ? '#f0f9f0' : '#fff5f5'}; border-radius: 8px; border-left: 4px solid ${welcomeEmailResult.success ? '#22c55e' : '#ef4444'};">
            <div style="color: ${welcomeEmailResult.success ? '#166534' : '#dc2626'}; font-size: 14px; font-weight: 500; margin-bottom: 4px;">
              Welcome Email Status
            </div>
            <div style="color: ${welcomeEmailResult.success ? '#15803d' : '#dc2626'}; font-size: 13px;">
              ${welcomeEmailResult.success ? '✅ Sent successfully' : '❌ Failed to send'}
            </div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
            🏋️ Another fitness enthusiast has joined the FitnessFreaks community!
          </div>
          <div style="color: #999; font-size: 12px;">
            Total newsletter subscribers are growing strong 💪
          </div>
        </div>
      </div>
    `;

    const adminEmailResult = await sendEmailWithResend(
      adminEmail,
      "🚨 New Newsletter Subscription - FitnessFreaks",
      adminEmailHtml
    );

    console.log("Admin notification result:", adminEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome to FitnessFreaks! Check your email for a special welcome message.",
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
    console.error("Error in newsletter subscription:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process newsletter subscription"
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
