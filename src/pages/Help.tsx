
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Book, Dumbbell, CreditCard, Smartphone, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const categories = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Workouts & Training",
      description: "Questions about exercises, workout plans, and training programs",
      badge: "Popular",
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Billing & Subscriptions",
      description: "Payment, subscription management, and pricing questions",
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Technical Support",
      description: "App issues, login problems, and technical troubleshooting",
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: "Getting Started",
      description: "New user guides, setup help, and platform basics",
      badge: "Beginner",
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    },
  ];

  const faqs = [
    {
      category: "General",
      question: "How do I get started with FitnessFreaks?",
      answer: "Simply sign up for a free account, complete your fitness profile, and we'll create personalized workout and nutrition plans for you. You can start with our free features or upgrade to Pro for advanced AI recommendations.",
    },
    {
      category: "Workouts",
      question: "Can I customize my workout plans?",
      answer: "Yes! Our AI creates personalized plans based on your goals, fitness level, and preferences. Pro users can further customize exercises, duration, and intensity levels.",
    },
    {
      category: "Nutrition",
      question: "Do you provide meal plans and nutrition guidance?",
      answer: "Absolutely! We offer personalized nutrition plans, macro tracking, and meal suggestions based on your dietary preferences and fitness goals.",
    },
    {
      category: "Billing",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro subscription at any time through your account settings. You'll continue to have Pro access until the end of your billing period.",
    },
    {
      category: "Technical",
      question: "Is FitnessFreaks available on mobile devices?",
      answer: "Yes! FitnessFreaks is fully responsive and works great on all devices. We also have dedicated mobile apps available for iOS and Android.",
    },
    {
      category: "Community",
      question: "How do I join the FitnessFreaks community?",
      answer: "Pro subscribers get access to our exclusive community features where you can share progress, get motivation, and connect with other fitness enthusiasts.",
    },
  ];

  const contactOptions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      availability: "Available 24/7",
      action: "Start Chat",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24h",
      action: "Send Email",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
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
                How can we help you?
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Find answers to common questions, browse our help topics, or get in touch with our support team.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for help topics..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-black dark:focus:border-white focus:outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Help Categories */}
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
                Browse Help Topics
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Quick access to the most common help topics
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${category.color}`}>
                        {category.icon}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
                        {category.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-center">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Quick answers to the most common questions
              </p>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span className="font-semibold text-lg">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400 pb-6 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Contact Support */}
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
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our support team is here to help you with any questions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {contactOptions.map((option, index) => (
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
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-black dark:text-white">
                        {option.icon}
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{option.title}</CardTitle>
                      <CardDescription className="mb-4">{option.description}</CardDescription>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {option.availability}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Link to="/contact">
                        <Button className="w-full bg-black hover:bg-gray-800 text-white">
                          {option.action}
                        </Button>
                      </Link>
                    </CardContent>
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

export default Help;
