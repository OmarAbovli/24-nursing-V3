
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ServiceSummary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [additionalServices, setAdditionalServices] = useState("no");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    toast({
      title: "Service completed",
      description: "Your service summary has been submitted.",
    });
    setShowRating(true);
  };

  const handleRatingSubmit = () => {
    toast({
      title: "Thank you",
      description: "Your feedback has been submitted.",
    });
    navigate("/nurse/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/nurse/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Service Summary</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        {showRating ? (
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle>Rate Your Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    onClick={() => setRating(star)}
                    className={star <= rating ? "text-yellow-500" : "text-muted"}
                  >
                    <Star className="w-8 h-8" fill={star <= rating ? "currentColor" : "none"} />
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments (Optional)</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Share your experience with this patient..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRatingSubmit} className="w-full">
                Submit Rating
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Patient:</span>
                    <span className="font-medium">Ahmed Hassan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Service Type:</span>
                    <span className="font-medium">Prescribed treatment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Base Fee:</span>
                    <span className="font-medium">200 EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="font-medium">May 7, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={additionalServices}
                  onValueChange={setAdditionalServices}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes, I provided additional services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No additional services</Label>
                  </div>
                </RadioGroup>

                {additionalServices === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="additional-notes">Please describe:</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Describe the additional services provided..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} className="w-full">
                  <Check className="w-4 h-4 mr-2" />
                  Finish
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ServiceSummary;
