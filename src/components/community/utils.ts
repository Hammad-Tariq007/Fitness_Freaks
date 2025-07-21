
export function formatTimeAgo(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Simple linkify for hashtags/URLs
export function linkifyText(text: string) {
  let result = text;
  // Hashtag
  result = result.replace(/#(\w+)/g, '<span class="text-blue-500 font-medium hover:underline cursor-pointer">#$1</span>');
  // URL
  result = result.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 underline break-all" target="_blank">$1</a>');
  // Bold/Italic (Markdown style)
  result = result.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  result = result.replace(/\*(.*?)\*/g, "<i>$1</i>");
  return result;
}
