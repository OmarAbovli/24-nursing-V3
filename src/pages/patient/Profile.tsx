
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone as PhoneIcon, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Droplets
} from "lucide-react";
import { userProfileService } from "@/services/userProfileService";
import { authService } from "@/services/authService";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/assets/logo";

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First try to get from localStorage for immediate display
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUserData(storedUser);
        }
        
        // Then fetch fresh data from API
        const profileData = await userProfileService.getProfile();
        setUserData(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleBackToDashboard = () => {
    navigate("/patient/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Logo size={36} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </Button>
      </header>

      <main className="container px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-col items-center">
            <div className="mb-4">
              <Avatar className="h-24 w-24">
                {userData?.profileImage ? (
                  <AvatarImage src={userData.profileImage} alt={userData.name || "User"} />
                ) : (
                  <AvatarFallback>
                    {(userData?.name?.charAt(0) || "U").toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{userData?.name || "User"}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{userData?.email || "Not provided"}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                <span>{userData?.phone || "Not provided"}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{userData?.address || "Not provided"}</span>
              </div>

              {userData?.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Date of Birth: {userData.dateOfBirth}</span>
                </div>
              )}

              <Separator className="my-4" />
              
              {userData?.bloodType && (
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-muted-foreground" />
                  <span>Blood Type: {userData.bloodType}</span>
                </div>
              )}
              
              {userData?.medicalConditions && userData.medicalConditions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    Medical Conditions
                  </h3>
                  <ul className="list-disc pl-10">
                    {userData.medicalConditions.map((condition: string, index: number) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {userData?.allergies && userData.allergies.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    Allergies
                  </h3>
                  <ul className="list-disc pl-10">
                    {userData.allergies.map((allergy: string, index: number) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
