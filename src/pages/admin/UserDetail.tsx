
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowLeft, Check, X, User, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  userType: "patient" | "nurse" | "admin";
  name: string;
  phone: string;
  address?: string;
  profileComplete: boolean;
  isActive: boolean;
  nationalId?: string;
  registrationDate: string;
  activationDate?: string;
  dateOfBirth?: string;
  gender?: string;
  licenseId?: string;
  specializations?: string[];
  experience?: string;
}

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    
    fetchUserDetails();
  }, [userId]);
  
  const fetchUserDetails = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // This would call an API endpoint to get user details
      // For now, let's mock it by getting all users and finding the one we need
      const allUsers = await authService.getAllUsers();
      const userDetail = allUsers.find(u => u.id === userId);
      
      if (userDetail) {
        setUser(userDetail as UserProfile);
      } else {
        toast({
          title: t("Error"),
          description: t("User not found."),
          variant: "destructive",
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load user details."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivate = async () => {
    if (!userId) return;
    
    try {
      await authService.activateUser(userId);
      toast({
        title: t("Success"),
        description: t("User has been activated."),
      });
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error("Error activating user:", error);
      toast({
        title: t("Error"),
        description: t("Failed to activate user."),
        variant: "destructive",
      });
    }
  };
  
  const handleDeactivate = async () => {
    if (!userId) return;
    
    try {
      await authService.deactivateUser(userId);
      toast({
        title: t("Success"),
        description: t("User has been deactivated."),
      });
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: t("Error"),
        description: t("Failed to deactivate user."),
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    if (!userId) return;
    
    try {
      await authService.deleteUser(userId);
      toast({
        title: t("Success"),
        description: t("User has been deleted."),
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: t("Error"),
        description: t("Failed to delete user."),
        variant: "destructive",
      });
    }
  };
  
  const getUserTypeLabel = (userType: string) => {
    switch(userType) {
      case "patient": return t("Patient");
      case "nurse": return t("Medical Cadres");
      case "admin": return t("Admin");
      default: return userType;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t("User Details")}</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container mx-auto p-4 md:p-6 max-w-3xl">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : user ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? t("Active") : t("Pending")}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("User Type")}
                      </h3>
                      <p>{getUserTypeLabel(user.userType)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("Phone")}
                      </h3>
                      <p>{user.phone}</p>
                    </div>
                    
                    {user.address && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          {t("Address")}
                        </h3>
                        <p>{user.address}</p>
                      </div>
                    )}
                    
                    {user.nationalId && user.userType === "patient" && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          {t("National ID")}
                        </h3>
                        <p>{user.nationalId}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">
                        {t("Registration Date")}
                      </h3>
                      <p>{user.registrationDate ? format(new Date(user.registrationDate), "MMM d, yyyy") : "N/A"}</p>
                    </div>
                    
                    {user.activationDate && (
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <h3 className="text-sm font-medium">
                          {t("Activation Date")}
                        </h3>
                        <p>{format(new Date(user.activationDate), "MMM d, yyyy")}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">
                        {t("Profile Status")}
                      </h3>
                      <Badge variant={user.profileComplete ? "outline" : "secondary"}>
                        {user.profileComplete ? t("Complete") : t("Incomplete")}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Medical Cadres specific information */}
                {user.userType === "nurse" && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      {t("Medical Cadres Information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.licenseId && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {t("License ID")}
                          </h3>
                          <p>{user.licenseId}</p>
                        </div>
                      )}
                      
                      {user.experience && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {t("Experience")}
                          </h3>
                          <p>{user.experience}</p>
                        </div>
                      )}
                      
                      {user.specializations && user.specializations.length > 0 && (
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {t("Specializations")}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {user.specializations.map((spec, index) => (
                              <Badge key={index} variant="outline">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Patient specific information */}
                {user.userType === "patient" && user.dateOfBirth && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      {t("Patient Information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          {t("Date of Birth")}
                        </h3>
                        <p>{format(new Date(user.dateOfBirth), "MMM d, yyyy")}</p>
                      </div>
                      
                      {user.gender && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {t("Gender")}
                          </h3>
                          <p>{user.gender}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  {t("Back to Dashboard")}
                </Button>
                
                {user.isActive ? (
                  <Button
                    variant="destructive"
                    onClick={handleDeactivate}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("Deactivate User")}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleActivate}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t("Activate User")}
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  {t("Delete User")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="text-center py-10">
            <p>{t("User not found")}</p>
            <Button
              variant="link"
              onClick={() => navigate("/admin/dashboard")}
            >
              {t("Back to Dashboard")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDetailPage;
