
import { 
  BarChart3, 
  Users, 
  Dumbbell, 
  Utensils, 
  BookOpen, 
  MessageSquare,
  FileText,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed = false, 
  onToggleCollapse 
}: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "nutrition", label: "Nutrition Plans", icon: Utensils },
    { id: "blogs", label: "Blog Posts", icon: BookOpen },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("p-6", isCollapsed && "px-2 py-6")}>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center h-12 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200",
                  isActive && "bg-accent text-foreground font-medium border-l-2 border-primary",
                  isCollapsed ? "justify-center p-0" : "justify-start px-4 space-x-3"
                )}
                tabIndex={0}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

