
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo";
import { useTranslation } from "@/hooks/use-translation";
import { User, Stethoscope } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle navigation with error handling
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to direct location change if navigate fails
      window.location.href = path;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo size={80} />
          <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">
            {t("Choose Your Role")}
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            {t("Select your role to continue to the appropriate login page")}
          </p>
        </div>

        <div className="space-y-4">
          <Card
            className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleNavigation("/patient/login")}
          >
            <CardContent className="flex items-center p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-base font-medium leading-none">
                  {t("Patient")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Request healthcare services")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
            onClick={() => handleNavigation("/nurse/login")}
          >
            <CardContent className="flex items-center p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-base font-medium leading-none">
                  {t("Medical Cadres")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Provide healthcare services")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="link"
          className="w-full"
          onClick={() => handleNavigation("/")}
        >
          {t("Back to Home")}
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
