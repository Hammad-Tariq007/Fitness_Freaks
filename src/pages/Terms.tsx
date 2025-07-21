
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "User Accounts",
      content: [
        "You must be at least 13 years old to create an account",
        "You are responsible for maintaining the security of your account credentials",
        "One account per person; sharing accounts is prohibited",
        "You must provide accurate and complete information when registering",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: "Subscription and Payments",
      content: [
        "Subscription fees are billed monthly or annually based on your chosen plan",
        "All payments are processed securely through our payment partners",
        "Subscriptions automatically renew unless cancelled before the next billing cycle",
        "Refunds are provided according to our refund policy (within 14 days of purchase)",
        "Price changes will be communicated 30 days in advance"
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Acceptable Use",
      content: [
        "Use the platform only for lawful purposes and in accordance with these terms",
        "Do not attempt to hack, reverse engineer, or compromise our systems",
        "Respect other users and maintain a positive community environment",
        "Do not share inappropriate content or engage in harassment",
        "Commercial use requires explicit written permission from FitnessFreaks"
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Intellectual Property",
      content: [
        "All content, features, and functionality are owned by FitnessFreaks",
        "You may not copy, distribute, or create derivative works from our content",
        "User-generated content remains your property, but you grant us license to use it",
        "Our trademarks and logos may not be used without permission",
        "We respect intellectual property rights and expect users to do the same"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      title: "Health and Safety Disclaimer",
      content: [
        "Our platform provides general fitness and nutrition information, not medical advice",
        "Consult healthcare professionals before starting any new fitness or diet program",
        "You participate in workouts and follow nutrition plans at your own risk",
        "We are not liable for injuries or health issues resulting from platform use",
        "Stop exercising immediately if you experience pain or discomfort"
      ]
    },
    {
      icon: <Scale className="w-6 h-6 text-primary" />,
      title: "Limitation of Liability",
      content: [
        "FitnessFreaks is provided 'as is' without warranties of any kind",
        "We are not liable for indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid for our services",
        "We do not guarantee uninterrupted or error-free service",
        "Force majeure events are beyond our control and responsibility"
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
                <FileText className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Please read these terms carefully before using our services.
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
                  Welcome to FitnessFreaks
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your use of the FitnessFreaks platform, 
                  including our website, mobile application, and related services (collectively, the "Service"). 
                  By accessing or using our Service, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  If you disagree with any part of these terms, then you may not access the Service. 
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms Sections */}
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

        {/* Additional Terms */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <motion.div
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">
                  Changes to Terms
                </h3>
                <p className="text-yellow-700 dark:text-yellow-400 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </motion.div>

              <motion.div
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
                  Governing Law
                </h3>
                <p className="text-blue-700 dark:text-blue-400 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the State of California, 
                  without regard to its conflict of law provisions.
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us. 
                  We're here to help clarify any concerns you may have.
                </p>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Email us at: <span className="font-semibold text-primary">legal@fitnessfreaks.com</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
