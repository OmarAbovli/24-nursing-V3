
import { ReactNode } from "react";
import Logo from "@/assets/logo";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-accent/50">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size={60} />
        </div>
        
        <Card className="shadow-lg">
          {children}
        </Card>
        <p className="text-xs text-center text-muted-foreground">
          <Link to="/terms" className="hover:underline">
            {t("Terms & Conditions")}
          </Link>{" "}
          • © 2025 24h App
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
