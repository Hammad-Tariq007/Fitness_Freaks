
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Download } from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      title: "FitnessFreaks Raises $50M Series B to Revolutionize AI-Powered Fitness",
      date: "2024-03-15",
      category: "Funding",
      excerpt: "Leading fitness platform secures major funding round to expand AI capabilities and global reach.",
      source: "TechCrunch",
      link: "#",
    },
    {
      title: "The Future of Fitness: How AI is Personalizing Workouts",
      date: "2024-02-28",
      category: "Industry",
      excerpt: "FitnessFreaks CEO discusses the role of artificial intelligence in creating personalized fitness experiences.",
      source: "Forbes",
      link: "#",
    },
    {
      title: "FitnessFreaks Launches Community Features for Enhanced User Engagement",
      date: "2024-01-20",
      category: "Product",
      excerpt: "New social features enable users to connect, share progress, and motivate each other on their fitness journeys.",
      source: "Wired",
      link: "#",
    },
  ];

  const mediaKit = [
    { name: "Company Logo (PNG)", size: "2.3 MB" },
    { name: "Company Logo (SVG)", size: "156 KB" },
    { name: "Brand Guidelines", size: "8.7 MB" },
    { name: "Product Screenshots", size: "12.4 MB" },
    { name: "Executive Photos", size: "5.1 MB" },
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
                Press & Media
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get the latest news, press releases, and media resources from FitnessFreaks. 
                Revolutionizing fitness through AI-powered personalization.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Press Releases */}
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
                Latest News
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Stay updated with our latest announcements and industry insights
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
              {pressReleases.map((release, index) => (
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
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                          {release.category}
                        </Badge>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(release.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {release.title}
                      </CardTitle>
                      <CardDescription className="text-lg leading-relaxed mb-4">
                        {release.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Published in {release.source}
                        </span>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                          Read More
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
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
                Media Kit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Download our brand assets, logos, and press materials
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Download Resources</CardTitle>
                    <CardDescription className="text-center">
                      All the assets you need for featuring FitnessFreaks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mediaKit.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          <span className="font-medium text-black dark:text-white">{item.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({item.size})</span>
                        </div>
                        <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    ))}
                    <div className="pt-4">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        Download Complete Media Kit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                Media Inquiries
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                For press inquiries, interviews, or additional information, please reach out to our media team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                  Contact Press Team
                </Button>
                <span className="text-gray-600 dark:text-gray-400">
                  or email: press@fitnessfreaks.com
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
