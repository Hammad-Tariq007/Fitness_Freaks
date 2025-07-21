
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState, useEffect } from "react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

const Admin = () => {
  const { user, profile, loading } = useAuth();
  const { isAdmin } = usePremiumAccess();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect regular users back to their dashboard
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      // This will be handled by the Navigate component below
    }
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin - send to dashboard instead
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-16 flex">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <AdminDashboard activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
