
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestCredentials } from "./AuthTypes";

interface TestCredentialsAlertProps {
  testCredentials: TestCredentials;
  applyCredentials: () => void;
}

const TestCredentialsAlert = ({ 
  testCredentials, 
  applyCredentials 
}: TestCredentialsAlertProps) => {
  const { t } = useTranslation();

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>{t("Mock Backend Detected")}</AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <span>{t("Using mock backend for testing. You can use these test credentials:")}</span>
        <code className="bg-muted p-1 rounded text-xs">
          {t("Email")}: {testCredentials.email}<br />
          {t("Password")}: {testCredentials.password}
        </code>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={applyCredentials}
          type="button"
        >
          {t("Apply Test Credentials")}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TestCredentialsAlert;
