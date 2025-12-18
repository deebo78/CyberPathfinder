import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth, RequireAdmin } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Key, Trash2, Shield, User, Copy, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface AppUser {
  id: number;
  email: string;
  role: "admin" | "user";
  displayName: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
}

const inviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "user"]),
  displayName: z.string().optional()
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

function UserManagementContent() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const { data: users = [], isLoading } = useQuery<AppUser[]>({
    queryKey: ["/api/admin/users"]
  });

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "user",
      displayName: ""
    }
  });

  const inviteUserMutation = useMutation({
    mutationFn: async (data: InviteUserFormData) => {
      const response = await apiRequest("POST", "/api/admin/users", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setTempPassword(data.tempPassword);
      form.reset();
      toast({
        title: "User Invited",
        description: `${data.user.email} has been invited. Share the temporary password with them.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Invite User",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/reset-password`, {});
      return response.json();
    },
    onSuccess: (data) => {
      setTempPassword(data.tempPassword);
      toast({
        title: "Password Reset",
        description: "A new temporary password has been generated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Reset Password",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Updated",
        description: "User status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update User",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete User",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const onSubmit = (data: InviteUserFormData) => {
    inviteUserMutation.mutate(data);
  };

  const closeTempPasswordDialog = () => {
    setTempPassword(null);
    setIsInviteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">Invite and manage users who can access the platform</p>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-invite-user">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to a new user. They will receive a temporary password.
              </DialogDescription>
            </DialogHeader>
            
            {tempPassword ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    User Invited Successfully
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Share this temporary password with the user. They will be required to set a new password on first login.
                  </p>
                  <div className="flex items-center gap-2 bg-white rounded border p-2">
                    <code className="flex-1 font-mono text-lg" data-testid="text-temp-password">
                      {tempPassword}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(tempPassword)}
                      data-testid="button-copy-password"
                    >
                      {copiedPassword ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={closeTempPasswordDialog}>
                  Done
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="user@example.com"
                            data-testid="input-invite-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            data-testid="input-invite-display-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-invite-role">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={inviteUserMutation.isPending}
                      data-testid="button-submit-invite"
                    >
                      {inviteUserMutation.isPending ? "Inviting..." : "Send Invitation"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>All users with access to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        {user.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-purple-600" />
                        ) : (
                          <User className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || user.email.split('@')[0]}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.isActive}
                        disabled={user.id === currentUser?.id}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ userId: user.id, isActive: checked })
                        }
                        data-testid={`switch-user-active-${user.id}`}
                      />
                      <span className={user.isActive ? 'text-green-600' : 'text-gray-400'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {user.lastLoginAt 
                      ? format(new Date(user.lastLoginAt), 'MMM d, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetPasswordMutation.mutate(user.id)}
                        disabled={resetPasswordMutation.isPending}
                        data-testid={`button-reset-password-${user.id}`}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!tempPassword && !isInviteDialogOpen} onOpenChange={() => setTempPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Reset Complete</DialogTitle>
            <DialogDescription>
              Share this temporary password with the user.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700 mb-3">
              The user will be required to set a new password on their next login.
            </p>
            <div className="flex items-center gap-2 bg-white rounded border p-2">
              <code className="flex-1 font-mono text-lg" data-testid="text-reset-password">
                {tempPassword}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(tempPassword || '')}
              >
                {copiedPassword ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={() => setTempPassword(null)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UserManagement() {
  return (
    <RequireAdmin>
      <UserManagementContent />
    </RequireAdmin>
  );
}
