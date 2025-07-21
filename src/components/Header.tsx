import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Crown, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { motion } from 'framer-motion';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { hasPremiumAccess, isAdmin } = usePremiumAccess();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 xs:px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Dumbbell className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              FitnessFreaks
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/workouts" 
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 relative group font-medium"
            >
              Workouts
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/nutrition" 
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 relative group font-medium"
            >
              Nutrition
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 relative group font-medium"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && (hasPremiumAccess || isAdmin) && (
              <Link 
                to="/community" 
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 flex items-center gap-1 relative group font-medium"
              >
                <Crown className="w-4 h-4 text-purple-500" />
                Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            {!hasPremiumAccess && !isAdmin && (
              <Link 
                to="/pricing" 
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 font-semibold flex items-center gap-1 relative group"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>
          
          <div className="flex md:hidden items-center ml-auto">
            <details className="relative ml-2">
              <summary className="list-none cursor-pointer focus:outline-none">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </span>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-30 py-2 flex flex-col">
                <Link to="/workouts" className="px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium">Workouts</Link>
                <Link to="/nutrition" className="px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium">Nutrition</Link>
                <Link to="/blog" className="px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium">Blog</Link>
                {user && (hasPremiumAccess || isAdmin) && (
                  <Link to="/community" className="px-5 py-3 text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-xl font-medium">
                    <span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="8" cy="8" r="6" />
                        <path d="M8 4v4l3 3" />
                      </svg>
                    </span>
                    Community
                  </Link>
                )}
                {!hasPremiumAccess && !isAdmin && (
                  <Link to="/pricing" className="px-5 py-3 text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-xl font-medium">
                    Upgrade to Pro
                  </Link>
                )}
                <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
                {user ? (
                  <div className="flex flex-col items-stretch">
                    <button
                      onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                      className="px-5 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium text-left"
                    >
                      {isAdmin ? 'Admin Panel' : 'Dashboard'}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-5 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link to="/login" className="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium text-left">Sign In</Link>
                    <Link to="/signup" className="px-5 py-3 font-bold bg-black text-white dark:bg-white dark:text-black rounded-xl mt-1 text-center">Get Started</Link>
                  </div>
                )}
              </div>
            </details>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                {hasPremiumAccess && !isAdmin && (
                  <motion.div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Crown className="w-3 h-3" />
                    Pro
                  </motion.div>
                )}
                {isAdmin && (
                  <motion.div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                    whileHover={{ scale: 1.05 }}
                  >
                    Admin
                  </motion.div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                  className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <User className="w-4 h-4" />
                  {isAdmin ? 'Admin Panel' : 'Dashboard'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="hover:scale-105 transition-transform duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
