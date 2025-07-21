import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useBlog } from "@/hooks/useBlogs";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { marked } from "marked";
import DOMPurify from "dompurify";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlog(slug || "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'training':
        return 'bg-green-100/80 text-green-800 dark:bg-green-800/50 dark:text-green-100';
      case 'nutrition':
        return 'bg-orange-100/80 text-orange-800 dark:bg-orange-800/50 dark:text-orange-100';
      case 'recovery':
        return 'bg-purple-100/80 text-purple-800 dark:bg-purple-800/50 dark:text-purple-100';
      case 'mindset':
        return 'bg-blue-100/80 text-blue-800 dark:bg-blue-800/50 dark:text-blue-100';
      case 'science':
        return 'bg-red-100/80 text-red-800 dark:bg-red-800/50 dark:text-red-100';
      case 'technology':
        return 'bg-gray-100/80 text-gray-800 dark:bg-gray-800/50 dark:text-gray-100';
      default:
        return 'bg-gray-100/80 text-gray-800 dark:bg-gray-800/50 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog post not found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // After generating htmlContent, downgrade headings
  function downgradeHeadings(html: string) {
    // h1 becomes h2, h2 becomes h3, ..., h5 becomes h6, h6 stays h6
    let result = html;
    result = result.replace(/<h1(.*?)>/gi, "<h2$1>");
    result = result.replace(/<\/h1>/gi, "</h2>");
    result = result.replace(/<h2(.*?)>/gi, "<h3$1>");
    result = result.replace(/<\/h2>/gi, "</h3>");
    result = result.replace(/<h3(.*?)>/gi, "<h4$1>");
    result = result.replace(/<\/h3>/gi, "</h4>");
    result = result.replace(/<h4(.*?)>/gi, "<h5$1>");
    result = result.replace(/<\/h4>/gi, "</h5>");
    result = result.replace(/<h5(.*?)>/gi, "<h6$1>");
    result = result.replace(/<\/h5>/gi, "</h6>");
    // h6 stays h6
    return result;
  }

  const htmlContentRaw = blog.content
    ? DOMPurify.sanitize(
        marked.parse(blog.content, { async: false }) as string
      )
    : "";

  const htmlContent = downgradeHeadings(htmlContentRaw);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
        <motion.article
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-2 sm:px-6 py-10 sm:py-18"
        >
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-6"
            >
              <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </motion.div>
            {/* Card style header */}
            <motion.header
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mb-7"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-900/70 shadow-xl ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-md relative z-10">
                <div className="mb-4 flex gap-3 items-center">
                  <Badge className={getCategoryColor(blog.category) + " px-3 py-1 text-xs flex items-center gap-1"}>
                    <Tag className="w-3 h-3 mr-1" />
                    {blog.category}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                  {blog.title}
                </h1>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6 text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{blog.author_name}</span>
                  </div>
                  <span className="hidden md:inline-block">·</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(blog.published_at)}</span>
                  </div>
                </div>
                {blog.excerpt && (
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-snug mb-1 font-light italic">
                    {blog.excerpt}
                  </p>
                )}
              </div>
              {/* Floating blurred background flair */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-80 h-16 bg-primary/10 blur-2xl rounded-full z-0 pointer-events-none"></div>
            </motion.header>
            {/* Featured Image Card */}
            {blog.cover_image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mb-10"
              >
                <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10 bg-gray-50 dark:bg-gray-900/40">
                  <img
                    src={blog.cover_image_url}
                    alt={blog.title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover"
                  />
                </div>
              </motion.div>
            )}
            {/* Article Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-none"
            >
              <div
                className="prose max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h1:text-base prose-h1:mb-3 prose-h1:mt-7 prose-h1:leading-tight
                  prose-h2:text-sm prose-h2:mb-2 prose-h2:mt-6 prose-h2:leading-tight
                  prose-h3:text-xs prose-h3:mb-1 prose-h3:mt-5 prose-h3:leading-tight
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[1rem]
                  prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-a:text-primary dark:prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:text-base
                  prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  bg-white/90 dark:bg-gray-900/80 shadow-md ring-1 ring-black/[.07] dark:ring-white/5 rounded-2xl px-6 md:px-10 py-8"
                dangerouslySetInnerHTML={{
                  __html: htmlContent
                }}
              />
            </motion.div>
            {/* Subtle Divider */}
            <div className="my-12 border-t border-gray-200 dark:border-gray-800"></div>
            {/* Article Footer Card */}
            <motion.footer
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-0 mb-4"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-2xl bg-white/95 dark:bg-gray-900/90 shadow-lg p-7 border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{blog.author_name}</span>
                  </div>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 leading-relaxed font-light italic">
                    {blog.author_name} is a fitness expert and contributing writer for FitnessFreaks.
                  </p>
                </div>
                <Button asChild className="flex-shrink-0 mt-4 md:mt-0 shadow hover:scale-105 transition-transform">
                  <Link to="/blog">
                    Read More Articles
                  </Link>
                </Button>
              </div>
            </motion.footer>
          </div>
        </motion.article>
    </div>
  );
};

export default BlogPost;
