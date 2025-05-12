
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { useTranslation } from "@/hooks/use-translation";

export const AccountStatusAlert = () => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  useEffect(() => {
    const checkAccountStatus = () => {
      const active = authService.isActiveAccount();
      setIsActive(active);
      setCheckingStatus(false);
    };
    
    checkAccountStatus();
    
    // Check for status changes periodically (every 5 minutes)
    const interval = setInterval(checkAccountStatus, 5 * 60 * 1000);
    
    // Request notification permission
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    return () => clearInterval(interval);
  }, []);
  
  if (checkingStatus) return null;
  if (isActive) return null;
  
  return (
    <Alert variant={isActive ? "default" : "warning"} className="mb-4">
      {isActive ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isActive ? t("Account Active") : t("Account Pending Activation")}
      </AlertTitle>
      <AlertDescription>
        {isActive 
          ? t("Your account is active. You can make service requests.")
          : t("Your account is pending administrator approval. Please wait up to 24 hours before making service requests. You'll be notified when your account is activated.")}
      </AlertDescription>
    </Alert>
  );
};
