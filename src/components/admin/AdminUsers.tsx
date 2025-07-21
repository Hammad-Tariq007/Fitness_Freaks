import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ShieldCheck, User, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: string;
  created_at: string;
  goal: string;
}

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<{id: string, name: string} | null>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching all users from user_profiles...");
      
      // Fetch all user profiles directly - RLS should allow admin access
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log("Fetched users:", data);
      return data as UserProfile[];
    },
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      console.log("Fetching subscriptions...");
      const { data, error } = await supabase
        .from("subscriptions")
        .select("user_id, plan, is_active");

      if (error) {
        console.error("Error fetching subscriptions:", error);
        throw error;
      }
      
      console.log("Fetched subscriptions:", data);
      return data;
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      console.log("Updating user role:", userId, newRole);
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating user role:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      console.error("Role update mutation error:", error);
      toast.error("Failed to update user role");
    },
  });

  const deleteUser = async (userId: string, name: string) => {
    setConfirmDelete({ id: userId, name });
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    toast.loading("Deleting user...");
    try {
      // 1. First, delete from user_profiles: this will update the UI in real-time
      const { error: dbError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", confirmDelete.id);

      if (dbError) {
        throw new Error(dbError.message || "Failed to delete user from user_profiles");
      }

      // 2. Then, call the edge function to delete from Auth
      const resp = await fetch("/functions/v1/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: confirmDelete.id }),
      });

      if (!resp.ok) {
        const details = await resp.json();
        throw new Error(details?.error || "Failed to delete user from Auth");
      }

      toast.success("User deleted successfully");
      // Users list will auto-update due to Supabase realtime & useQuery
      setConfirmDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Error deleting user");
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserSubscription = (userId: string) => {
    return subscriptions?.find(sub => sub.user_id === userId && sub.is_active);
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            <p className="font-medium">Error loading users</p>
            <p className="text-sm mt-1">{error.message}</p>
            <p className="text-sm mt-2">This might be due to RLS policies. Make sure you're logged in as an admin.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-bold">{confirmDelete?.name}</span>?
              <br />
              This cannot be undone. The user will be removed from Auth and user_profiles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            All Users ({filteredUsers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers && filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => {
                  const subscription = getUserSubscription(user.user_id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscription ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {subscription.plan}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">{user.goal}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => {
                              toggleAdminMutation.mutate({ 
                                userId: user.user_id, 
                                newRole 
                              });
                            }}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* Show delete button for admins, hide on self and other admins */}
                          {user.role !== "admin" && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="ml-1"
                              onClick={() => deleteUser(user.user_id, user.name)}
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {users && users.length === 0 ? (
                <>
                  <p className="text-lg font-medium mb-2">No users found</p>
                  <p className="text-sm">This might be due to RLS policies. Check your admin permissions.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">No users match your search</p>
                  <p className="text-sm">Try adjusting your search terms or filters</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
