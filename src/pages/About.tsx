
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, Target, Heart, Award, Zap, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Goal-Oriented",
      description: "We believe every fitness journey should have clear, achievable goals backed by science and personalization."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Health First",
      description: "Your wellbeing is our priority. We promote sustainable, healthy approaches to fitness and nutrition."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "Leveraging AI and cutting-edge technology to make fitness more accessible and effective for everyone."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "Building a supportive global community where fitness enthusiasts can connect, share, and grow together."
    }
  ];

  const team = [
    {
      name: "Hammad Bin Tariq",
      role: "Co-founder & Chief Executive Officer (CEO)",
      bio: "Visionary leader driving the business strategy, partnerships, and growth roadmap.",
      image: "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Huzaifa Amin",
      role: "Co-founder & Chief Marketing Officer (CMO)",
      bio: "Brand builder and growth strategist focused on community engagement and user acquisition.",
      image: "https://images.unsplash.com/photo-1627135345338-a2024b1aea9d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Muhammad Zubair",
      role: "Co-founder & Chief Operating Officer (COO)",
      bio: "Process-oriented executor overseeing operations, logistics, and team coordination.",
      image: "https://images.unsplash.com/photo-1611316185995-9624c94487d1?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Muhammad Hamza Rashid",
      role: "Co-founder & Chief Technology Officer (CTO)",
      bio: "Tech-savvy innovator responsible for platform architecture, development, and scalability.",
      image: "https://images.unsplash.com/photo-1502307100811-6bdc0981a85b?w=300&h=300&fit=crop&crop=face"
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
              <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 tracking-tight">
                About FitnessFreaks
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing fitness through AI-powered personalization, making health and wellness accessible to everyone, everywhere.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  At FitnessFreaks, we believe that everyone deserves access to personalized, effective fitness guidance. Our mission is to democratize fitness by combining cutting-edge AI technology with expert knowledge from certified trainers and nutritionists.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  We're not just another fitness app – we're your intelligent fitness companion, adapting to your unique needs, preferences, and goals to help you achieve sustainable results.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop"
                  alt="People exercising together"
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Passionate experts dedicated to your fitness success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Active Users</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Workouts Completed</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Satisfaction Rate</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
