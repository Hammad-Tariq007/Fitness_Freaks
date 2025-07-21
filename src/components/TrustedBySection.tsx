
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TrustedBySection = () => {
  const brands = [
    { 
      name: "Under Armour", 
      url: "https://underarmour.com",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Under-Armour-Logo.png"
    },
    { 
      name: "Reebok", 
      url: "https://reebok.com",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo.png"
    },
    { 
      name: "Adidas", 
      url: "https://adidas.com",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png"
    },
    { 
      name: "Puma", 
      url: "https://puma.com",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png"
    },
    { 
      name: "Nike", 
      url: "https://nike.com",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png"
    },
  ];

  return (
    <section className="py-8 md:py-20 bg-black dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-gray-400 font-medium mb-3 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Trusted by leading fitness brands
          </motion.p>
          
          <TooltipProvider>
            <div className="flex items-center justify-center gap-4 xs:gap-8 lg:gap-16 flex-wrap">
              {brands.map((brand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.a
                        href={brand.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-2 sm:p-4 rounded-lg transition-all duration-500 hover:scale-110 filter grayscale hover:grayscale-0"
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        <div className="w-16 sm:w-20 h-10 sm:h-12 flex items-center justify-center">
                          <span className="text-xs sm:text-lg font-bold text-white group-hover:text-white transition-all duration-300">
                            {brand.name}
                          </span>
                        </div>
                      </motion.a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{brand.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </div>
          </TooltipProvider>
        </motion.div>
      </div>
    </section>
  );
};

