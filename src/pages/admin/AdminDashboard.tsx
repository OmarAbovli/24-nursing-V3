
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/hooks/use-theme";
import { 
  Search, 
  User, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Trash2,
  AlertCircle,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { format } from "date-fns";

interface UserData {
  id: string;
  email: string;
  userType: "patient" | "nurse" | "admin";
  name: string;
  phone: string;
  isActive: boolean;
  registrationDate: string;
  profileComplete: boolean;
  nationalId?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "delete">("activate");
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.userType !== "admin") {
      toast({
        title: t("Unauthorized"),
        description: t("You need admin privileges to access this page."),
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const userData = await authService.getAllUsers();
      setUsers(userData);
      
      // Filter users by activation status
      setPendingUsers(userData.filter(user => !user.isActive));
      setActiveUsers(userData.filter(user => user.isActive));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load user data."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivateUser = (user: UserData) => {
    setSelectedUser(user);
    setActionType("activate");
    setShowConfirmDialog(true);
  };
  
  const handleDeactivateUser = (user: UserData) => {
    setSelectedUser(user);
    setActionType("deactivate");
    setShowConfirmDialog(true);
  };
  
  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setActionType("delete");
    setShowConfirmDialog(true);
  };
  
  const confirmAction = async () => {
    if (!selectedUser) return;
    
    try {
      if (actionType === "activate") {
        await authService.activateUser(selectedUser.id);
        toast({
          title: t("Success"),
          description: t("User has been activated."),
        });
      } else if (actionType === "deactivate") {
        await authService.deactivateUser(selectedUser.id);
        toast({
          title: t("Success"),
          description: t("User has been deactivated."),
        });
      } else if (actionType === "delete") {
        await authService.deleteUser(selectedUser.id);
        toast({
          title: t("Success"),
          description: t("User has been deleted."),
        });
      }
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error("Error performing action:", error);
      toast({
        title: t("Error"),
        description: t(`Failed to ${actionType} user.`),
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
      setSelectedUser(null);
    }
  };
  
  const filterUsers = (userList: UserData[]) => {
    if (!searchQuery) return userList;
    
    const query = searchQuery.toLowerCase();
    return userList.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      (user.nationalId && user.nationalId.includes(query))
    );
  };
  
  const getUserTypeLabel = (userType: string) => {
    switch(userType) {
      case "patient": return t("Patient");
      case "nurse": return t("Medical Cadres");
      case "admin": return t("Admin");
      default: return userType;
    }
  };
  
  const renderUserTable = (userList: UserData[]) => {
    const filteredUsers = filterUsers(userList);
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin" />
        </div>
      );
    }
    
    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          {searchQuery ? t("No users match your search") : t("No users found")}
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Name")}</TableHead>
            <TableHead>{t("Email")}</TableHead>
            <TableHead>{t("Type")}</TableHead>
            <TableHead>{t("Registration Date")}</TableHead>
            <TableHead>{t("Status")}</TableHead>
            <TableHead className="text-right">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getUserTypeLabel(user.userType)}</TableCell>
              <TableCell>
                {user.registrationDate ? format(new Date(user.registrationDate), "MMM d, yyyy") : "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? t("Active") : t("Pending")}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/user/${user.id}`)}
                >
                  {t("View")}
                </Button>
                
                {user.isActive ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeactivateUser(user)}
                  >
                    {t("Deactivate")}
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleActivateUser(user)}
                  >
                    {t("Activate")}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteUser(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("Admin Dashboard")}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button onClick={() => navigate("/admin/profile")}>
              <User className="h-4 w-4 mr-2" />
              {t("Profile")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("User Management")}</CardTitle>
            <CardDescription>
              {t("Manage user accounts, approvals and permissions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  className="pl-10" 
                  placeholder={t("Search users...")} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={fetchUsers}
                >
                  {t("Refresh")}
                </Button>
              </div>
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">
                  {t("Pending Approval")} ({pendingUsers.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  {t("Active Users")} ({activeUsers.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-6">
                {renderUserTable(pendingUsers)}
              </TabsContent>
              <TabsContent value="active" className="mt-6">
                {renderUserTable(activeUsers)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "activate" 
                ? t("Activate User") 
                : actionType === "deactivate"
                  ? t("Deactivate User")
                  : t("Delete User")
              }
            </DialogTitle>
            <DialogDescription>
              {actionType === "activate" 
                ? t("Are you sure you want to activate this user? They will be able to use the platform.")
                : actionType === "deactivate"
                  ? t("Are you sure you want to deactivate this user? They will not be able to log in.")
                  : t("Are you sure you want to delete this user? This action cannot be undone.")
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t("Cancel")}
            </Button>
            <Button 
              variant={actionType === "delete" ? "destructive" : "default"}
              onClick={confirmAction}
            >
              {actionType === "activate" 
                ? t("Activate") 
                : actionType === "deactivate"
                  ? t("Deactivate")
                  : t("Delete")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
