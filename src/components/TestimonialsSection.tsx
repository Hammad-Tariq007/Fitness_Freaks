
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "FitnessFreaks completely transformed my approach to fitness. The AI recommendations are spot-on and I've never felt stronger.",
      name: "Sarah Johnson",
      result: "Lost 25 lbs in 4 months",
      avatar: "https://images.pexels.com/photos/789305/pexels-photo-789305.jpeg?auto=compress&cs=tinysrgb&w=600?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      quote: "The nutrition plans are incredible. I finally understand what my body needs and the results speak for themselves.",
      name: "Mike Chen",
      result: "Gained 15 lbs muscle",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      quote: "As a busy mom, I love how the app adapts to my schedule. Quick workouts that actually work!",
      name: "Emma Rodriguez",
      result: "Improved energy & strength",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      quote: "The progress tracking and insights keep me motivated. I can actually see how I'm improving week by week.",
      name: "David Thompson",
      result: "Ran first marathon",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real Results from Real People
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of fitness enthusiasts who have transformed their lives with FitnessFreaks.
          </motion.p>
        </motion.div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <div className="font-bold text-black dark:text-white text-lg">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{testimonial.result}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="lg:hidden relative">
          <motion.div
            key={currentTestimonial}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <blockquote className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            
            <div className="flex items-center">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
              <div>
                <div className="font-bold text-black dark:text-white text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{testimonials[currentTestimonial].result}</div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full hover:scale-110 transition-transform duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full hover:scale-110 transition-transform duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentTestimonial ? 'bg-black dark:bg-white w-8' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
