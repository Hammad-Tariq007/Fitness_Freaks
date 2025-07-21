
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Heart, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Join our team to build the future of fitness technology with React, TypeScript, and cutting-edge AI integration.",
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      description: "Create beautiful, intuitive experiences that help millions achieve their fitness goals.",
    },
    {
      title: "AI/ML Engineer",
      department: "Data Science",
      location: "Remote / Austin",
      type: "Full-time",
      description: "Develop intelligent algorithms that personalize fitness and nutrition recommendations.",
    },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      description: "We believe wellness starts with our team. Comprehensive health benefits and fitness stipends for all.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diverse Team",
      description: "Building an inclusive environment where everyone can thrive and bring their authentic selves.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "We're pushing the boundaries of fitness technology with AI, machine learning, and data science.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Impact",
      description: "Every line of code, every design decision helps millions of people achieve their fitness goals.",
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
                Join the FitnessFreaks Team
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Help us revolutionize fitness through AI-powered personalization. Build products that inspire millions to live healthier lives.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl">
                View Open Positions
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Values
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                What drives us every day and shapes our culture
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-black dark:text-white">
                        {value.icon}
                      </div>
                      <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
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
                Open Positions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join our mission to transform fitness through technology
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          Open
                        </Badge>
                      </div>
                      <CardDescription className="text-lg leading-relaxed">
                        {job.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/contact">
                        <Button className="bg-black hover:bg-gray-800 text-white">
                          Apply Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Don't see a perfect fit? We're always looking for talented people!
              </p>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-2">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
