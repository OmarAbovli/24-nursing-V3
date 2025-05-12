
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Upload, Camera, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NurseRegisterInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [faceVerificationComplete, setFaceVerificationComplete] = useState(false);
  const [verificationImages, setVerificationImages] = useState({
    front: false,
    right: false,
    left: false,
    up: false,
  });

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setCurrentStep(currentStep + 1);
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded successfully.",
      });
    }, 2000);
  };

  const handleFaceCapture = (direction: keyof typeof verificationImages) => {
    const updatedImages = { ...verificationImages, [direction]: true };
    setVerificationImages(updatedImages);
    
    toast({
      title: "Image captured",
      description: `${direction} facing image captured successfully.`,
    });
    
    // Check if all images are captured
    if (Object.values(updatedImages).every(val => val)) {
      setTimeout(() => {
        setFaceVerificationComplete(true);
        toast({
          title: "Verification complete",
          description: "Face verification successful.",
        });
      }, 1500);
    }
  };

  const completeRegistration = () => {
    toast({
      title: "Registration successful",
      description: "Your nurse account has been created.",
    });
    navigate("/nurse/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/nurse/login")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Complete Registration</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Registration Progress</p>
            <p className="text-sm font-medium">{currentStep}/3</p>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
        
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>National ID</CardTitle>
              <CardDescription>
                Please upload a clear image of your national ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-40 border-dashed"
                onClick={simulateUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                    <p className="font-medium">Upload ID</p>
                    <p className="text-xs text-muted-foreground">
                      Click to select a file
                    </p>
                  </div>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Supported formats: JPG, PNG, PDF. Max size: 5MB
              </p>
            </CardContent>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Nursing License</CardTitle>
              <CardDescription>
                Please upload your professional nursing license
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-40 border-dashed"
                onClick={simulateUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                    <p className="font-medium">Upload License</p>
                    <p className="text-xs text-muted-foreground">
                      Click to select a file
                    </p>
                  </div>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Supported formats: JPG, PNG, PDF. Max size: 5MB
              </p>
            </CardContent>
          </Card>
        )}
        
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Face Verification</CardTitle>
              <CardDescription>
                Please complete the face verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {faceVerificationComplete ? (
                <div className="flex flex-col items-center p-6 space-y-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Verification Complete</h3>
                  <p className="text-center text-green-600">
                    Your identity has been successfully verified
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative w-full h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                    <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant={verificationImages.front ? "default" : "outline"} 
                      className="flex-1"
                      onClick={() => handleFaceCapture("front")}
                      disabled={verificationImages.front}
                    >
                      {verificationImages.front ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Front
                        </>
                      ) : (
                        "Front"
                      )}
                    </Button>
                    <Button 
                      variant={verificationImages.right ? "default" : "outline"} 
                      className="flex-1"
                      onClick={() => handleFaceCapture("right")}
                      disabled={verificationImages.right}
                    >
                      {verificationImages.right ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Right
                        </>
                      ) : (
                        "Right"
                      )}
                    </Button>
                    <Button 
                      variant={verificationImages.left ? "default" : "outline"} 
                      className="flex-1"
                      onClick={() => handleFaceCapture("left")}
                      disabled={verificationImages.left}
                    >
                      {verificationImages.left ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Left
                        </>
                      ) : (
                        "Left"
                      )}
                    </Button>
                    <Button 
                      variant={verificationImages.up ? "default" : "outline"} 
                      className="flex-1"
                      onClick={() => handleFaceCapture("up")}
                      disabled={verificationImages.up}
                    >
                      {verificationImages.up ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Up
                        </>
                      ) : (
                        "Up"
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Please click each button to capture your face from that angle
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {faceVerificationComplete && (
                <Button 
                  className="w-full" 
                  onClick={completeRegistration}
                >
                  Complete Registration
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default NurseRegisterInfo;
