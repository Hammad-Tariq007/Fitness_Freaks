
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { user } = useAuth();
  const { subscription, hasProAccess, createCheckoutSession } = useSubscription();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Welcome to FitnessFreaks Pro! Your subscription is now active.",
      });
    }
    if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "No worries! You can upgrade anytime.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const handleUpgrade = async (priceId: string, plan: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createCheckoutSession(priceId, plan);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      icon: Star,
      features: [
        "Access to 3 workouts",
        "Basic nutrition plans",
        "Community access",
        "BMI calculator",
        "Progress tracking (basic)",
      ],
      limitations: [
        "Limited workout library",
        "No premium features",
        "No AI recommendations",
      ],
      cta: hasProAccess ? "Current Plan" : "Get Started",
      popular: false,
      priceId: null,
    },
    {
      name: "Pro",
      price: { monthly: 9.99, yearly: 99.99 },
      description: "Unlock your full potential",
      icon: Crown,
      features: [
        "Unlimited workout access",
        "Personalized nutrition plans", 
        "AI-powered recommendations",
        "Advanced progress analytics",
        "Priority community support",
        "Exclusive pro content",
        "Export progress reports",
        "Custom workout plans",
      ],
      limitations: [],
      cta: hasProAccess ? "Current Plan" : "Upgrade to Pro",
      popular: true,
      priceId: {
        monthly: "price_1RUN2vPPAg1ItBHa6c1j9sW7", // Replace with your actual Stripe price ID
        yearly: "price_1RUN49PPAg1ItBHaq8UPaVXf", // Replace with your actual Stripe price ID
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            Choose Your Fitness Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Unlock premium features and transform your fitness experience with our Pro plan
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isYearly
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full transition-all ${
                isYearly
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2">Save 17%</Badge>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = 
              (plan.name === 'Free' && !hasProAccess) ||
              (plan.name === 'Pro' && hasProAccess);
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${
                  plan.popular 
                    ? 'border-2 border-purple-200 dark:border-purple-600 shadow-xl' 
                    : 'border border-gray-200 dark:border-gray-700'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                        }`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                        {plan.price.monthly > 0 && (
                          <span className="text-lg text-gray-500">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {isYearly && plan.price.monthly > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button
                      onClick={() => {
                        if (plan.priceId && !isCurrentPlan) {
                          const priceId = isYearly ? plan.priceId.yearly : plan.priceId.monthly;
                          handleUpgrade(priceId, plan.name.toLowerCase());
                        }
                      }}
                      disabled={isCurrentPlan || !plan.priceId}
                      className={`w-full ${
                        plan.popular && !isCurrentPlan
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          : isCurrentPlan
                          ? 'bg-green-600 hover:bg-green-600'
                          : ''
                      }`}
                      size="lg"
                    >
                      {isCurrentPlan ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                          {plan.cta}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Questions about our plans? 
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cancel anytime. No hidden fees. 30-day money-back guarantee.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
