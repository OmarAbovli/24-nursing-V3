
import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import TestCredentialsAlert from "./TestCredentialsAlert";
import { AuthFormProps, TestCredentials } from "./AuthTypes";

const RegisterForm = ({ userType }: Pick<AuthFormProps, 'userType'>) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [nationalId, setNationalId] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [testCredentials, setTestCredentials] = useState<TestCredentials | null>(null);

  // Check for test credentials on component mount
  useState(() => {
    try {
      const mockUser = authService.getTestCredentials();
      if (mockUser) {
        console.log("Test credentials loaded:", mockUser.email);
        setTestCredentials(mockUser);
      }
    } catch (error) {
      console.error("Error loading test credentials:", error);
    }
  });

  // Fill form with test credentials
  const applyTestCredentials = () => {
    if (testCredentials) {
      setEmail(testCredentials.email);
      setPassword(testCredentials.password);
      setConfirmPassword(testCredentials.password);
      setFullName("Test User"); 
      setPhone("+201234567890"); 
      setNationalId("12345678901234");
      setAcceptTerms(true);
    }
  };

  const validateEgyptianPhone = (phone: string) => {
    // Egyptian phone numbers: +20 followed by 10 digits, or 01 followed by 9 digits
    const egyptianPhoneRegex = /^(\+201|01)[0-9]{9}$/;
    return egyptianPhoneRegex.test(phone);
  };

  const validateNationalId = (id: string) => {
    // Egyptian National ID is 14 digits
    const nationalIdRegex = /^[0-9]{14}$/;
    return nationalIdRegex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    try {
      // Form validation
      if (!acceptTerms) {
        setFormError(t("You must accept the terms and conditions to register."));
        toast({
          title: t("Terms & Conditions Required"),
          description: t("You must accept the terms and conditions to register."),
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        setFormError(t("Passwords do not match."));
        toast({
          title: t("Password Mismatch"),
          description: t("Passwords do not match. Please try again."),
          variant: "destructive",
        });
        return;
      }
      
      if (password.length < 6) {
        setFormError(t("Password must be at least 6 characters long."));
        toast({
          title: t("Password Too Short"),
          description: t("Password must be at least 6 characters long."),
          variant: "destructive",
        });
        return;
      }
      
      // Validate full name and phone for registration
      if (!fullName.trim()) {
        setFormError(t("Full name is required."));
        toast({
          title: t("Full Name Required"),
          description: t("Please enter your full name."),
          variant: "destructive",
        });
        return;
      }
      
      if (!phone.trim()) {
        setFormError(t("Phone number is required."));
        toast({
          title: t("Phone Number Required"),
          description: t("Please enter your phone number."),
          variant: "destructive",
        });
        return;
      }

      if (!validateEgyptianPhone(phone)) {
        setFormError(t("Please enter a valid Egyptian phone number."));
        toast({
          title: t("Invalid Phone Number"),
          description: t("Please enter a valid Egyptian phone number (starting with +201 or 01)."),
          variant: "destructive",
        });
        return;
      }
      
      // Validate National ID for patient registration
      if (userType === "patient" && !validateNationalId(nationalId)) {
        setFormError(t("Please enter a valid 14-digit National ID."));
        toast({
          title: t("Invalid National ID"),
          description: t("Please enter a valid 14-digit Egyptian National ID."),
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      
      try {
        // For registration, we still specify the userType
        console.log("Registering with data:", { 
          email, 
          password, 
          userType,
          name: fullName,
          phone,
          nationalId: userType === "patient" ? nationalId : undefined
        });
        
        const registerResult = await authService.register({ 
          email, 
          password, 
          userType,
          name: fullName,
          phone,
          nationalId: userType === "patient" ? nationalId : undefined,
          isActive: false // New accounts start as inactive
        });
        
        console.log("Registration successful", registerResult);
        toast({
          title: t("Registration Successful"),
          description: t("Your account has been created! It is pending activation by an administrator."),
        });
        
        // Don't logout - redirect to the appropriate dashboard with inactive status
        const redirectPath = authService.getRedirectPath();
        console.log("Redirecting new user to:", redirectPath);
        navigate(redirectPath);
      } catch (error) {
        console.error("Registration error details:", error);
        const errorMessage = error.response?.data?.message || t("Registration failed. Please try again.");
        setFormError(errorMessage);
        toast({
          title: t("Registration Failed"),
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
          {t("Create Account")}
        </CardTitle>
        <CardDescription className="text-center">
          {t(`Register as a new ${getUserTypeDisplay()}`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formError && (
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
          <Label htmlFor="fullName">{t("Full Name")}</Label>
          <Input
            id="fullName"
            placeholder={t("Enter your full name")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">{t("Phone Number")}</Label>
          <Input
            id="phone"
            placeholder={t("Enter your Egyptian phone number (e.g., 01xxxxxxxxx)")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        
        {/* National ID field for patients */}
        {userType === "patient" && (
          <div className="space-y-2">
            <Label htmlFor="nationalId">{t("National ID")}</Label>
            <Input
              id="nationalId"
              placeholder={t("Enter your 14-digit National ID")}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
            />
          </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("Confirm Password")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("Confirm your password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(!!checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("I accept the")}{" "}
            <Link to="/terms" className="text-primary underline">
              {t("Terms & Conditions")}
            </Link>
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-transparent rounded-full animate-spin" />
              {t("Registering...")}
            </>
          ) : (
            t("Register")
          )}
        </Button>

        <p className="text-sm text-center">
          {t("Already have an account? ")}
          <Link
            to={userType === "patient" ? "/patient/login" : "/nurse/login"}
            className="text-primary font-medium"
          >
            {t("Sign In")}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
