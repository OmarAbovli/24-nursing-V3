
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";
import { authService } from "@/services/authService";
import { AccountStatusAlert } from "@/components/AccountStatusAlert";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("prescribed");
  const [details, setDetails] = useState("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Check account activation status on component mount
    const checkAccountStatus = () => {
      const isActiveAccount = authService.isActiveAccount();
      setIsActive(isActiveAccount);
      
      if (!isActiveAccount) {
        toast({
          title: "Account Pending Activation",
          description: "Your account is pending activation by an administrator. Please wait for approval before making service requests.",
          variant: "destructive", // Changed from "warning" to "destructive"
          duration: 6000,
        });
      }
    };
    
    checkAccountStatus();
  }, [toast]);

  const detectLocation = () => {
    setIsGpsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // You might want to call a geocoding API here to convert coordinates to address
            // For now, we'll just use the coordinates
            const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
            setAddress(coords);
            
            toast({
              title: "Location detected",
              description: "Your location has been automatically filled in.",
            });
          } catch (error) {
            console.error("Error getting address:", error);
            toast({
              title: "Location error",
              description: "Could not determine your address. Please enter manually.",
              variant: "destructive",
            });
          } finally {
            setIsGpsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsGpsLoading(false);
          toast({
            title: "Location error",
            description: "Could not access your location. Please check permissions.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsGpsLoading(false);
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent inactive accounts from submitting requests
    if (!isActive) {
      toast({
        title: "Account Pending Activation",
        description: "Please wait up to 24 hours for your account to be activated by an administrator before making service requests.",
        variant: "destructive",
      });
      return;
    }
    
    if (!patientName || !patientAge || !address || !details) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await patientService.requestService({
        patientName,
        patientAge,
        address,
        serviceType,
        details
      });
      
      toast({
        title: "Request submitted",
        description: "Your service request has been successfully submitted.",
      });
      
      navigate("/patient/track-request");
    } catch (error) {
      console.error("Service request error:", error);
      toast({
        title: "Request failed",
        description: error.response?.data?.message || "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/patient/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Request Nurse Service</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        {!isActive && (
          <Alert variant="destructive" className="mb-6"> {/* Changed from "warning" to "destructive" */}
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Account Pending Activation</AlertTitle>
            <AlertDescription>
              Your account is waiting for administrator approval. Please wait up to 24 hours before making service requests. You'll receive a notification when your account is activated.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientAge">Patient Age</Label>
            <Input
              id="patientAge"
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="Age in years"
              min="0"
              max="120"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex space-x-2">
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your full address"
                className="flex-1"
                required
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={detectLocation}
                disabled={isGpsLoading}
              >
                {isGpsLoading ? (
                  <div className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Click the location icon to auto-detect your address
            </p>
          </div>
          
          <div className="space-y-3">
            <Label>Service Type</Label>
            <RadioGroup
              value={serviceType}
              onValueChange={setServiceType}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prescribed" id="prescribed" />
                <Label htmlFor="prescribed" className="cursor-pointer">
                  Prescribed treatment by doctor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emergency" id="emergency" />
                <Label htmlFor="emergency" className="cursor-pointer">
                  Emergency medical condition
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Detailed Request</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide details about your medical condition or required treatment..."
              className="min-h-[120px]"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !isActive}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 rounded-full border-t-transparent animate-spin" />
                Submitting...
              </>
            ) : !isActive ? (
              "Account Pending Approval"
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default ServiceRequestForm;
