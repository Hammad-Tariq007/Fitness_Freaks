import { Instagram, Facebook, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Resources",
      links: [
        { name: "Workout Library", href: "/workouts" },
        { name: "Nutrition Plans", href: "/nutrition" },
        { name: "Community", href: "/community" },
        { name: "Blog", href: "/blog" },
        { name: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partnerships", href: "/partnerships" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Accessibility", href: "/accessibility" },
        { name: "Cookie Policy", href: "/cookie-policy" },
      ],
    },
  ];

  // Updated social links per instructions
  const socialLinks = [
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://www.instagram.com/fitnessfreaks.pk27?igsh=ZHdzeXQ2b3prcGhj",
      label: "Instagram"
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/share/1a32xSfwPX/",
      label: "Facebook"
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 xs:px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 sm:mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <motion.div 
                className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Dumbbell className="w-6 h-6 text-white dark:text-black" />
              </motion.div>
              <span className="text-2xl font-bold text-black dark:text-white">FitnessFreaks</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-base sm:text-lg text-left sm:text-left">
              AI-powered fitness platform helping you achieve your health goals with personalized workouts and nutrition plans.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600"
                  aria-label={social.label}
                  whileHover={{ y: -4, scale: 1.05 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links, adjusted to stack on mobile */}
          {footerSections.map((section, index) => (
            <div key={index} className="mt-8 md:mt-0">
              <h3 className="font-bold text-black dark:text-white mb-3 sm:mb-6 text-base sm:text-lg">{section.title}</h3>
              <ul className="space-y-2 sm:space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-base hover:translate-x-1 inline-block duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar, stack on small screens */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 dark:text-gray-400 text-base mb-2 sm:mb-0 text-center sm:text-left">
            © 2025 FitnessFreaks. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base text-gray-600 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/help" className="hover:text-black dark:hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors z-40"
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
      )}
    </footer>
  );
};
