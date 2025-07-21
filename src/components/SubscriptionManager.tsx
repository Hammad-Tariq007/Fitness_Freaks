
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Calendar, CreditCard, Settings, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SubscriptionManager: React.FC = () => {
  const { subscription, hasProAccess, openCustomerPortal, loading, checkSubscription } = useSubscription();
  const { toast } = useToast();
  const [isManaging, setIsManaging] = useState(false);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      await openCustomerPortal();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsManaging(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await checkSubscription();
      toast({
        title: "Status Updated",
        description: "Your subscription status has been refreshed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={hasProAccess ? 'border-purple-200 dark:border-purple-600' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {hasProAccess ? (
              <Crown className="w-6 h-6 text-purple-600" />
            ) : (
              <CreditCard className="w-6 h-6 text-gray-600" />
            )}
            Subscription Management
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold capitalize">
                  {subscription?.plan || 'Free'} Plan
                </span>
                {hasProAccess && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {hasProAccess 
                  ? 'You have access to all premium features'
                  : 'Limited access to basic features'
                }
              </p>
            </div>
          </div>

          {subscription?.expires_at && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>
                {hasProAccess ? 'Renews' : 'Expired'} on{' '}
                {new Date(subscription.expires_at).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {hasProAccess ? (
              <>
                <Button 
                  onClick={handleManageSubscription}
                  variant="outline" 
                  className="w-full"
                  disabled={isManaging}
                >
                  {isManaging ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  {isManaging ? 'Opening Portal...' : 'Manage Subscription'}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        To cancel your subscription, you'll be redirected to the Stripe Customer Portal where you can safely manage your billing settings. 
                        Your subscription will remain active until the end of your current billing period.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction onClick={handleManageSubscription} className="bg-red-600 hover:bg-red-700">
                        Continue to Portal
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}

            <Button 
              onClick={handleRefreshStatus}
              variant="ghost" 
              size="sm"
              className="w-full text-xs"
            >
              Refresh Status
            </Button>
          </div>

          {hasProAccess && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Pro benefits:</strong> Unlimited workouts, AI recommendations, 
                advanced analytics, and priority support.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
