
import { AdminDashboardStats } from "./AdminDashboardStats";
import { AdminUsers } from "./AdminUsers";
import { AdminWorkouts } from "./AdminWorkouts";
import { AdminNutrition } from "./AdminNutrition";
import { AdminBlogs } from "./AdminBlogs";
import { AdminCommunity } from "./AdminCommunity";
import { AdminReports } from "./AdminReports";

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard = ({ activeTab }: AdminDashboardProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboardStats />;
      case "users":
        return <AdminUsers />;
      case "workouts":
        return <AdminWorkouts />;
      case "nutrition":
        return <AdminNutrition />;
      case "blogs":
        return <AdminBlogs />;
      case "community":
        return <AdminCommunity />;
      case "reports":
        return <AdminReports />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="p-8">
      {renderContent()}
    </div>
  );
};
