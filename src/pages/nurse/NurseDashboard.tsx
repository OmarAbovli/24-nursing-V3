
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User, Navigation, Check, Moon, Sun, Languages, DollarSign } from "lucide-react";
import Logo from "@/assets/logo";
import { useToast } from "@/hooks/use-toast";
import { nurseService } from "@/services/nurseService";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { authService } from "@/services/authService";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [serviceStarted, setServiceStarted] = useState(false);
  const [patientRequests, setPatientRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [patientQuestions, setPatientQuestions] = useState([
    { 
      id: 'q1', 
      title: 'Diabetes Management', 
      description: 'How do I manage my diabetes with diet?',
      patient: 'Ahmed Hassan',
      date: '2025-05-08'
    },
    { 
      id: 'q2', 
      title: 'Blood Pressure', 
      description: 'What should I do about my high blood pressure?',
      patient: 'Sara Mahmoud',
      date: '2025-05-09'
    }
  ]);

  // Load requests on component mount and when availability changes
  useEffect(() => {
    if (isAvailable) {
      // Simulate getting requests from the API
      setTimeout(() => {
        setHasActiveRequest(true);
        toast({
          title: t("New request received"),
          description: t("A patient has requested your service."),
        });
      }, 5000);
    }
  }, [isAvailable, toast, t]);

  const toggleAvailability = async () => {
    try {
      // Toggle availability state
      const newAvailability = !isAvailable;
      setIsAvailable(newAvailability);
      
      await nurseService.toggleAvailability(newAvailability);
      
      if (newAvailability) {
        toast({
          title: t("You're now available"),
          description: t("You will now receive service requests."),
        });
      } else {
        if (!hasActiveRequest) {
          toast({
            title: t("You're now offline"),
            description: t("You will no longer receive service requests."),
          });
        } else {
          toast({
            title: t("Cannot go offline"),
            description: t("You have an active request in progress."),
            variant: "destructive",
          });
          setIsAvailable(true);
        }
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: t("Error"),
        description: t("Could not update your availability status."),
        variant: "destructive",
      });
    }
  };

  const startService = () => {
    setServiceStarted(true);
    toast({
      title: t("Service started"),
      description: t("You have started assisting the patient."),
    });
  };

  const completeService = () => {
    navigate("/nurse/service-summary");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const handleProfileClick = () => {
    navigate("/nurse/profile");
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleAnswerQuestion = (questionId) => {
    navigate(`/nurse/answer-question/${questionId}`);
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
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
            aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
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
        <div className="mb-8 flex flex-col items-center">
          <div className="p-3 mb-4 rounded-full bg-accent">
            <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"} ${isAvailable ? "animate-pulse" : ""}`} />
          </div>
          <h1 className="text-xl font-bold text-center text-foreground">
            {isAvailable ? t("You are available for duty") : t("You are offline")}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <Switch 
              checked={isAvailable} 
              onCheckedChange={toggleAvailability}
              disabled={hasActiveRequest && isAvailable} 
            />
            <span className="text-sm text-muted-foreground">
              {isAvailable ? t("Available") : t("Offline")}
            </span>
          </div>
        </div>

        <Tabs defaultValue="requests" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">{t("Requests")}</TabsTrigger>
            <TabsTrigger value="questions">{t("Patient Questions")}</TabsTrigger>
            <TabsTrigger value="earnings">{t("Earnings")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            {hasActiveRequest && (
              <Card className="mb-6 border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span>{t("Active Request")}</span>
                    <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t("Patient Name")}:</span>
                      <span className="font-medium">Ahmed Hassan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t("Age")}:</span>
                      <span className="font-medium">45 {t("years")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t("Service Type")}:</span>
                      <span className="font-medium">{t("Prescribed treatment")}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent">
                    <h3 className="font-medium">{t("Request Details")}:</h3>
                    <p className="mt-1 text-sm">
                      {t("Need assistance with daily insulin injection and blood pressure measurement. Patient has all necessary equipment and medication.")}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t("Address")}:</span>
                      <span className="font-medium">123 El-Nasr St, Cairo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Location")}:</span>
                      <Button variant="outline" size="sm" className="h-8">
                        <Navigation className="w-3 h-3 mr-1" />
                        {t("Open in Maps")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {serviceStarted ? (
                    <Button 
                      onClick={completeService} 
                      className="w-full"
                      variant="default"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {t("Mark Service as Complete")}
                    </Button>
                  ) : (
                    <Button 
                      onClick={startService} 
                      className="w-full"
                    >
                      {t("Start Assisting Patient")}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
            
            {!hasActiveRequest && isAvailable && (
              <Card className="bg-accent border-0">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 rounded-full border-primary border-t-transparent animate-spin" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">{t("Waiting for requests...")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    {t("You'll be notified when a patient requests your service")}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {!hasActiveRequest && !isAvailable && (
              <Card className="bg-accent border-0">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">{t("You're currently offline")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    {t("Toggle the switch above to make yourself available for service requests")}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="questions">
            <h2 className="text-xl font-semibold mb-4 text-foreground">{t("Patient Questions")}</h2>
            {patientQuestions.length > 0 ? (
              <div className="space-y-4">
                {patientQuestions.map(question => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{question.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{question.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>{t("From")}: {question.patient}</span>
                        <span>{question.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => handleAnswerQuestion(question.id)}
                      >
                        {t("Answer Question")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-accent border-0">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <h3 className="text-lg font-medium text-foreground">{t("No patient questions")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    {t("You'll be notified when patients ask medical questions")}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    {t("Total Earned")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">$450</p>
                  <p className="text-sm text-muted-foreground">{t("Last 30 days")}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <DollarSign className="w-5 h-5 mr-2 text-amber-500" />
                    {t("Pending Payments")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">$120</p>
                  <p className="text-sm text-muted-foreground">{t("To be settled")}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">{t("Recent Payments")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium text-foreground">Ahmed Hassan</p>
                      <p className="text-sm text-muted-foreground">May 7, 2025</p>
                    </div>
                    <span className="text-green-500 font-medium">+$50</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium text-foreground">Sara Mahmoud</p>
                      <p className="text-sm text-muted-foreground">May 5, 2025</p>
                    </div>
                    <span className="text-green-500 font-medium">+$75</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium text-foreground">Mohamed Ali</p>
                      <p className="text-sm text-muted-foreground">May 3, 2025</p>
                    </div>
                    <span className="text-green-500 font-medium">+$60</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-4 mt-auto text-center text-sm text-muted-foreground">
        <p>© 2025 24h App. {t("All rights reserved.")}</p>
      </footer>
    </div>
  );
};

export default NurseDashboard;
