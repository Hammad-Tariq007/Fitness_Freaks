
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Building2, Users, Globe, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Partnerships = () => {
  const partnershipTypes = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Gym & Fitness Centers",
      description: "Partner with us to offer your members premium AI-powered workout plans and nutrition guidance.",
      benefits: ["Increased member retention", "Premium service offerings", "Revenue sharing opportunities"],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Corporate Wellness",
      description: "Enhance employee wellness programs with personalized fitness and nutrition solutions.",
      benefits: ["Improved employee health", "Reduced healthcare costs", "Productivity boost"],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Brand Collaborations",
      description: "Join forces with leading fitness, nutrition, and wellness brands to reach new audiences.",
      benefits: ["Co-marketing opportunities", "Product integration", "Expanded reach"],
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Influencer Network",
      description: "Connect with fitness influencers and trainers to create authentic content and programs.",
      benefits: ["Authentic endorsements", "Content creation", "Community building"],
    },
  ];

  const currentPartners = [
    { name: "Nike", description: "Premium workout gear integration" },
    { name: "MyFitnessPal", description: "Nutrition tracking partnership" },
    { name: "Strava", description: "Activity sync and sharing" },
    { name: "Apple Health", description: "Seamless health data integration" },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Cutting-Edge Technology",
      description: "Access to our AI-powered fitness and nutrition platform",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Growing User Base",
      description: "Reach our 100K+ active users across global markets",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Targeted Marketing",
      description: "Precision targeting based on fitness goals and preferences",
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Revenue Sharing",
      description: "Mutually beneficial partnership models and revenue streams",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Partner With FitnessFreaks
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join us in revolutionizing the fitness industry. Create meaningful partnerships that drive growth, 
                innovation, and help millions achieve their health goals.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/contact">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl">
                  Start Partnership
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                Partnership Opportunities
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore different ways to collaborate and grow together
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {partnershipTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-black dark:text-white">
                        {type.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2">{type.title}</CardTitle>
                      <CardDescription className="text-lg leading-relaxed">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-black dark:text-white mb-3">Key Benefits:</h4>
                        {type.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                Why Partner With Us
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join a platform that's transforming how people approach fitness
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-black dark:text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-black dark:text-white">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-black dark:text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can create a partnership that drives mutual growth and success.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4">
                  Contact Partnership Team
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Current Partners */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                Trusted Partners
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We're proud to work with industry leaders
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{partner.name}</CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partnerships;
