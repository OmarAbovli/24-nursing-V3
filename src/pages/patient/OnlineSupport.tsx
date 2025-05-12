
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnlineSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCallRequested, setIsCallRequested] = useState(false);
  
  const requestCall = () => {
    setIsCallRequested(true);
    
    toast({
      title: "Call Requested",
      description: "A doctor will call you shortly.",
    });
    
    // Simulate call request timing out after 5 seconds
    setTimeout(() => {
      setIsCallRequested(false);
      toast({
        title: "Doctor is calling you",
        description: "Please answer your phone.",
      });
    }, 5000);
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
        <h1 className="text-lg font-semibold">Online Doctor Support</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container flex flex-col items-center justify-center px-4 py-10 max-w-md min-h-[80vh]">
        <div className="w-24 h-24 mb-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Phone className="w-12 h-12 text-primary" />
        </div>
        
        <h2 className="mb-2 text-2xl font-bold">Speak to a Doctor</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Get quick medical advice from our professional doctors.
        </p>
        
        <Button 
          size="lg"
          onClick={requestCall}
          disabled={isCallRequested}
          className="px-8"
        >
          {isCallRequested ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 rounded-full border-t-transparent animate-spin" />
              Requesting Call...
            </>
          ) : (
            "Request Doctor Call"
          )}
        </Button>
        
        <div className="mt-10 text-center">
          <h3 className="mb-2 font-semibold">Operating Hours</h3>
          <p className="text-muted-foreground">9:00 AM - 10:00 PM</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: This service is for general medical inquiries only.
            For emergencies, please visit the nearest hospital.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OnlineSupport;
