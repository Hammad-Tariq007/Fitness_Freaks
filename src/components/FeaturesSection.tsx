
import { motion } from "framer-motion";
import { Brain, Apple, TrendingUp, Camera, Users, Crown } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Workouts",
      description: "AI-powered exercise routines that adapt to your fitness level, preferences, and goals using advanced machine learning.",
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: "Personalized Diet Plans",
      description: "Custom meal plans and macro tracking based on your dietary restrictions, fitness goals, and lifestyle preferences.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Detailed analytics, progress photos, and performance metrics with beautiful charts to keep you motivated.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Forum",
      description: "Connect with fellow fitness enthusiasts, share your journey, and get support from our amazing community.",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI Assistant (Google Gemini)",
      description: "Chat with our intelligent fitness assistant for personalized advice, tips, and motivation 24/7.",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Subscription Access",
      description: "Unlock premium features including advanced analytics, exclusive workouts, and priority support.",
    },
  ];

  return (
    <section className="py-16 sm:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-4 sm:mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-full sm:max-w-3xl mx-auto text-base sm:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our comprehensive platform combines cutting-edge AI technology with proven fitness science to deliver results that matter.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 xs:p-8 sm:p-10 rounded-2xl sm:rounded-3xl hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="text-black dark:text-white mb-5 sm:mb-8 relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg sm:text-2xl font-bold text-black dark:text-white mb-2 sm:mb-6 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

