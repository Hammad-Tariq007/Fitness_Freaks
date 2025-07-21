
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Ear, Hand, Brain, Smartphone, Monitor } from "lucide-react";

const Accessibility = () => {
  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visual Accessibility",
      description: "High contrast modes, scalable text, and screen reader compatibility for users with visual impairments.",
      features: ["WCAG 2.1 AA compliant color contrast", "Scalable fonts up to 200%", "Screen reader optimization", "Alternative text for images"],
    },
    {
      icon: <Ear className="w-8 h-8" />,
      title: "Audio Accessibility",
      description: "Captions, transcripts, and visual indicators for users with hearing impairments.",
      features: ["Video captions and transcripts", "Visual workout cues", "Vibration feedback", "Sound-free navigation"],
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Motor Accessibility",
      description: "Keyboard navigation and adaptive interfaces for users with motor disabilities.",
      features: ["Full keyboard navigation", "Large touch targets", "Voice control support", "Customizable interface"],
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Cognitive Accessibility",
      description: "Simple layouts and clear instructions for users with cognitive disabilities.",
      features: ["Simple, consistent design", "Clear instructions", "Progress indicators", "Error prevention and recovery"],
    },
  ];

  const deviceSupport = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Devices",
      description: "iOS VoiceOver, Android TalkBack, and touch accessibility features",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Desktop & Web",
      description: "Screen readers, keyboard navigation, and browser accessibility tools",
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
                Accessibility Statement
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                At FitnessFreaks, we believe fitness should be accessible to everyone. We're committed to creating 
                an inclusive platform that works for users of all abilities.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8 text-center">
                Our Commitment
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                <p className="text-xl leading-relaxed">
                  FitnessFreaks is dedicated to ensuring digital accessibility for people with disabilities. 
                  We are continually improving the user experience for everyone and applying the relevant 
                  accessibility standards.
                </p>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mt-12 mb-6">
                  Standards and Guidelines
                </h3>
                <p>
                  We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. 
                  These guidelines explain how to make web content more accessible for people with disabilities 
                  and user-friendly for everyone.
                </p>
                
                <h3 className="text-2xl font-bold text-black dark:text-white mt-12 mb-6">
                  Ongoing Efforts
                </h3>
                <p>
                  We regularly review our platform and conduct accessibility audits to identify and fix 
                  potential barriers. Our development team receives ongoing training on accessibility 
                  best practices and inclusive design principles.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Accessibility Features */}
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
                Accessibility Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Comprehensive accessibility support across all aspects of our platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
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
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-lg leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Support */}
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
                Device Support
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Compatible with assistive technologies across all platforms
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {deviceSupport.map((device, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-black dark:text-white">
                        {device.icon}
                      </div>
                      <CardTitle className="text-xl font-bold">{device.title}</CardTitle>
                      <CardDescription className="text-lg">
                        {device.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
                Help Us Improve
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                If you experience any accessibility barriers while using FitnessFreaks, please let us know. 
                Your feedback helps us continue to improve our platform for everyone.
              </p>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-black dark:text-white">Email:</strong> accessibility@fitnessfreaks.com
                </p>
                <p>
                  <strong className="text-black dark:text-white">Response Time:</strong> We aim to respond to accessibility 
                  feedback within 2 business days
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

export default Accessibility;
