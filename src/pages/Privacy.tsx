
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, fitness goals)",
        "Usage data including workout preferences, nutrition tracking, and app interactions",
        "Device information and technical data for app optimization",
        "Payment information processed securely through our payment partners"
      ]
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "How We Use Your Information",
      content: [
        "Personalize your fitness and nutrition recommendations",
        "Track your progress and provide insights",
        "Improve our AI algorithms and app functionality",
        "Send you important updates about your account and our services",
        "Provide customer support and respond to your inquiries"
      ]
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Data Security",
      content: [
        "All data is encrypted in transit and at rest using industry-standard protocols",
        "We use secure cloud infrastructure with regular security audits",
        "Access to your data is strictly limited to authorized personnel",
        "We never store sensitive payment information on our servers"
      ]
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Information Sharing",
      content: [
        "We do not sell, rent, or trade your personal information to third parties",
        "Aggregate, anonymized data may be used for research and product improvement",
        "We may share information with service providers who help us operate our platform",
        "Legal compliance: We may disclose information when required by law"
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: "Your Rights",
      content: [
        "Access and download your personal data at any time",
        "Correct or update your information through your account settings",
        "Delete your account and associated data (some data may be retained for legal compliance)",
        "Opt out of non-essential communications",
        "Request information about how your data is processed"
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Cookies and Tracking",
      content: [
        "We use essential cookies for app functionality and user authentication",
        "Analytics cookies help us understand how you use our platform",
        "You can control cookie preferences through your browser settings",
        "Third-party services may use their own cookies (Google Analytics, payment processors)"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <Shield className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
              </p>
              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Last updated: January 15, 2024
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/5 p-8 rounded-2xl mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Commitment to Your Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  At FitnessFreaks, we understand that your personal information is valuable and sensitive. 
                  This privacy policy explains how we collect, use, protect, and share your information when you use our platform. 
                  We are committed to transparency and giving you control over your data.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-6">
                    {section.icon}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white ml-3">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  If you have any questions about this privacy policy or how we handle your data, 
                  please don't hesitate to contact us. We're here to help and ensure your privacy concerns are addressed.
                </p>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Email us at: <span className="font-semibold text-primary">privacy@fitnessfreaks.com</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
