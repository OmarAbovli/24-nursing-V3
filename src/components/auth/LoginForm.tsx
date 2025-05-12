
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { authService } from "@/services/authService";
import TestCredentialsAlert from "./TestCredentialsAlert";
import { TestCredentials, AuthFormProps } from "./AuthTypes";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = ({ userType }: Pick<AuthFormProps, 'userType'>) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState<TestCredentials | null>(null);

  // Check for test credentials on component mount
  useEffect(() => {
    try {
      const mockUser = authService.getTestCredentials();
      if (mockUser) {
        console.log("Test credentials loaded:", mockUser.email);
        setTestCredentials(mockUser);
      }
    } catch (error) {
      console.error("Error loading test credentials:", error);
    }
  }, []);

  // Fill form with test credentials
  const applyTestCredentials = () => {
    if (testCredentials) {
      setEmail(testCredentials.email);
      setPassword(testCredentials.password);
    }
  };

  // Check server connectivity
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch("/api");
        setConnectionError(false);
      } catch (error) {
        console.error("Server connection check failed:", error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    try {
      setIsLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
      try {
        // Perform login
        const loginResult = await authService.login({ email, password });
        console.log("Login successful", loginResult);
        toast({
          title: t("Success"),
          description: t("Login successful!"),
        });

        // Check if account is activated
        if (!loginResult.user.isActive) {
          console.log("Account is not activated");
          toast({
            title: t("Account Pending Activation"),
            description: t("Your account is pending activation by an administrator."),
            variant: "destructive", 
          });
        }
        
        // Get proper redirect path based on user type
        const redirectPath = authService.getRedirectPath();
        console.log("Redirecting to:", redirectPath);
        navigate(redirectPath);
      } catch (error) {
        console.error("Login error details:", error);
        
        // Handle network errors specifically
        if (error.message === "Network Error") {
          setConnectionError(true);
          setFormError("Cannot connect to server. The backend server might be offline.");
          toast({
            title: t("Connection Failed"),
            description: t("Cannot connect to server. Please check if the backend is running."),
            variant: "destructive",
          });
          return;
        }
        
        // Handle other errors
        const errorMessage = error.response?.data?.message || t("Please check your credentials and try again.");
        setFormError(errorMessage);
        toast({
          title: t("Login Failed"),
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage = error.response?.data?.message || t("An unexpected error occurred. Please try again.");
      setFormError(errorMessage);
      toast({
        title: t("Authentication Failed"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the proper display name for the user type
  const getUserTypeDisplay = () => {
    if (userType === "nurse") {
      return t("Medical Cadres");
    }
    return t(userType.charAt(0).toUpperCase() + userType.slice(1));
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("Welcome Back")}
        </CardTitle>
        <CardDescription className="text-center">
          {t(`Sign in to your ${getUserTypeDisplay()} account`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Cannot connect to the server. Please ensure the backend server is running.
              <div className="mt-2 text-xs">
                <strong>Steps to solve:</strong>
                <ol className="list-decimal pl-4">
                  <li>Make sure your backend server is started (run <code>npm start</code> in the backend folder)</li>
                  <li>Check your MongoDB connection in .env file</li>
                  <li>Ensure there are no CORS issues</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}
      
        {formError && !connectionError && (
          <div className="p-3 text-sm text-white bg-red-500 rounded-md">
            {formError}
          </div>
        )}
        
        {testCredentials && (
          <TestCredentialsAlert 
            testCredentials={testCredentials}
            applyCredentials={applyTestCredentials}
          />
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">{t("Email")}</Label>
          <Input
            id="email"
            placeholder={t("Enter your email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("Password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("Enter your password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-transparent rounded-full animate-spin" />
              {t("Signing In...")}
            </>
          ) : (
            t("Sign In")
          )}
        </Button>

        <p className="text-sm text-center">
          {t("Don't have an account? ")}
          <Link
            to={userType === "patient" ? "/patient/register" : "/nurse/register"}
            className="text-primary font-medium"
          >
            {t("Register")}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
