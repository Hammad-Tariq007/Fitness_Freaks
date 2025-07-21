
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, Shield, Settings, BarChart3 } from "lucide-react";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Essential Cookies",
      badge: "Required",
      badgeVariant: "destructive" as const,
      description: "These cookies are necessary for the website to function and cannot be disabled.",
      examples: ["User authentication", "Security tokens", "Session management", "CSRF protection"],
      duration: "Session / 1 year",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Cookies",
      badge: "Optional",
      badgeVariant: "secondary" as const,
      description: "Help us understand how visitors interact with our website to improve user experience.",
      examples: ["Page views", "User behavior", "Performance metrics", "Error tracking"],
      duration: "2 years",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Functional Cookies",
      badge: "Optional",
      badgeVariant: "secondary" as const,
      description: "Enable enhanced functionality and personalization features.",
      examples: ["Language preferences", "Theme settings", "Workout preferences", "Location data"],
      duration: "1 year",
    },
  ];

  const thirdPartyServices = [
    { name: "Google Analytics", purpose: "Website analytics and user behavior tracking" },
    { name: "Stripe", purpose: "Payment processing and subscription management" },
    { name: "Supabase", purpose: "Database and authentication services" },
    { name: "YouTube", purpose: "Embedded workout videos and demonstrations" },
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
              <motion.div
                className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-orange-600 dark:text-orange-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Cookie className="w-10 h-10" />
              </motion.div>
              <motion.h1 
                className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Cookie Policy
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Learn about how we use cookies and similar technologies to enhance your experience on FitnessFreaks.
              </motion.p>
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Last updated: December 2024
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* What Are Cookies */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
                What Are Cookies?
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                <p className="text-xl leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and 
                  understanding how you use our platform.
                </p>
                <p>
                  Similar technologies like local storage, session storage, and web beacons may also be 
                  used for similar purposes throughout our platform.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Types of Cookies */}
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
                Types of Cookies We Use
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We use different types of cookies for various purposes
              </p>
            </motion.div>

            <div className="grid gap-8 max-w-4xl mx-auto">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-black dark:text-white">
                            {cookie.icon}
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold">{cookie.title}</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Duration: {cookie.duration}
                            </p>
                          </div>
                        </div>
                        <Badge variant={cookie.badgeVariant}>
                          {cookie.badge}
                        </Badge>
                      </div>
                      <CardDescription className="text-lg leading-relaxed">
                        {cookie.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-3">Examples:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {cookie.examples.map((example, idx) => (
                            <div key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
                Third-Party Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                We work with trusted third-party services that may also set cookies on your device:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {thirdPartyServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                        <CardDescription>{service.purpose}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
                Managing Your Cookie Preferences
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                <p className="text-xl leading-relaxed">
                  You have control over which cookies you accept. Here's how you can manage them:
                </p>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mt-12 mb-6">
                  Browser Settings
                </h3>
                <p>
                  Most browsers allow you to control cookies through their settings. You can usually:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>Get notified when cookies are set</li>
                </ul>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mt-12 mb-6">
                  Platform Settings
                </h3>
                <p>
                  When you first visit FitnessFreaks, you'll see a cookie banner where you can choose 
                  which types of optional cookies to accept. You can change these preferences at any 
                  time in your account settings.
                </p>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mt-12 mb-6">
                  Impact of Disabling Cookies
                </h3>
                <p>
                  Please note that disabling certain cookies may affect the functionality of our platform. 
                  Essential cookies are required for basic features like login and security.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
                Questions About Our Cookie Policy?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                If you have any questions about our use of cookies or this policy, please contact us.
              </p>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-black dark:text-white">Email:</strong> privacy@fitnessfreaks.com
                </p>
                <p>
                  <strong className="text-black dark:text-white">Last Updated:</strong> December 2024
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page 
                  with an updated revision date.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
