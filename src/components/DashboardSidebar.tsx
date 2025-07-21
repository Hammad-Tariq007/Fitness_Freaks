
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Dumbbell, 
  Heart, 
  Bot, 
  Crown, 
  User, 
  Menu,
  X,
  FileText
} from 'lucide-react';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const sidebarItems = [
  { id: 'progress', label: 'Progress Tracker', icon: BarChart3 },
  { id: 'workouts', label: 'Saved Workouts', icon: Dumbbell },
  { id: 'nutrition', label: 'Nutrition Plans', icon: Heart },
  { id: 'ai-coach', label: 'AI Coach', icon: Bot },
  { id: 'subscription', label: 'Subscription', icon: Crown },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className={cn(
      "bg-background border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FF</span>
            </div>
            <span className="text-foreground font-semibold text-lg">Dashboard</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 h-12",
                isActive && "bg-accent text-foreground font-medium border-l-2 border-primary",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
