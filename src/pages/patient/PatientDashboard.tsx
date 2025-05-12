
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceBox from "@/components/ServiceBox";
import { Bell, Clock, Heart, MessageSquare, Phone, Settings, User, Moon, Sun, Languages, AlertTriangle } from "lucide-react";
import Logo from "@/assets/logo";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/services/authService";
import { patientService } from "@/services/patientService";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const { toast } = useToast();
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  const [greeting] = useState<string>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const handleProfileClick = () => {
    navigate("/patient/profile");
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleEmergencyRequest = async () => {
    setIsEmergencyLoading(true);
    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await patientService.requestService({
                patientName: "Emergency",
                patientAge: "",
                serviceType: "emergency",
                details: "Emergency request - Immediate assistance needed",
                address: "Current location",
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }
              });

              toast({
                title: "Emergency request sent",
                description: "Nurses have been notified of your emergency",
              });
              navigate("/patient/track-request");
            } catch (error) {
              console.error("Error sending emergency request:", error);
              toast({
                title: "Error",
                description: "Could not send emergency request. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsEmergencyLoading(false);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location error",
              description: "Could not access your location. Please enable location services.",
              variant: "destructive",
            });
            setIsEmergencyLoading(false);
          }
        );
      } else {
        toast({
          title: "Not supported",
          description: "Geolocation is not supported by your browser.",
          variant: "destructive",
        });
        setIsEmergencyLoading(false);
      }
    } catch (error) {
      console.error("Emergency request error:", error);
      setIsEmergencyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card shadow-sm">
        <Logo size={36} />
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
          >
            <Languages className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("User Menu")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                {t("Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                {t("Logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t(greeting)}</h1>
          <p className="text-muted-foreground">{t("How can we assist you today?")}</p>
        </section>

        {/* Emergency Request Button */}
        <section className="mb-8">
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center py-6 text-lg"
            onClick={handleEmergencyRequest}
            disabled={isEmergencyLoading}
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            {isEmergencyLoading ? t("Sending...") : t("Send Emergency Request")}
          </Button>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            {t("For immediate medical assistance at your current location")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t("Our Services")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <ServiceBox 
              icon={Heart}
              title={t("Request Nurse")}
              onClick={() => navigate("/patient/request-service")}
            />
            <ServiceBox 
              icon={Clock}
              title={t("Track Request")}
              onClick={() => navigate("/patient/track-request")}
            />
            <ServiceBox 
              icon={MessageSquare}
              title={t("Online Support")}
              onClick={() => navigate("/patient/online-support")}
            />
            <ServiceBox 
              icon={Phone}
              title={t("Emergency Call")}
              onClick={() => window.open("tel:123")}
            />
          </div>
        </section>

        <Separator className="my-6" />

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t("Upcoming Appointments")}</h2>
          <div className="bg-muted/40 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">{t("No upcoming appointments")}</p>
            <Button
              variant="link"
              className="mt-2 text-primary"
              onClick={() => navigate("/patient/request-service")}
            >
              {t("Request a Service")}
            </Button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t("Medical Questions")}</h2>
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={() => navigate("/patient/ask-question")}
          >
            {t("Ask a Medical Question")}
          </Button>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
