
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Phone,
  Navigation,
  Upload,
  Star,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TrackRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const handlePayment = () => {
    if (paymentMethod === "cash") {
      simulateSuccess();
      return;
    }

    if (!transactionNumber || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    if (isUploading) return;

    // Simulate uploading
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      simulateSuccess();
    }, 1500);
  };

  const simulateSuccess = () => {
    setIsPaymentComplete(true);
    toast({
      title: "Payment successful",
      description: "Your payment has been received.",
    });
    
    // After 3 seconds show rating
    setTimeout(() => {
      setShowRating(true);
    }, 3000);
  };

  const handleRatingSubmit = () => {
    toast({
      title: "Thank you",
      description: "Your feedback has been submitted.",
    });
    navigate("/patient/dashboard");
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
        <h1 className="text-lg font-semibold">Track Your Request</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        {showRating ? (
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle>Rate Your Experience</CardTitle>
              <CardDescription>
                Please rate the service you received
              </CardDescription>
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
                  placeholder="Share your experience..."
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
                <CardTitle>Nurse Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">SN</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Sarah Nurse</h3>
                    <p className="text-sm text-muted-foreground">Registered Nurse, 5 years experience</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>+20 123 456 7890</span>
                </div>
                <div className="p-3 rounded-lg bg-accent">
                  <p className="font-medium">Estimated arrival: 15 minutes</p>
                  <div className="flex items-center mt-2">
                    <Navigation className="w-4 h-4 mr-2 text-primary animate-pulse" />
                    <span className="text-sm">Nurse is on the way</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Price Negotiation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-accent">
                  <p className="text-center">Agreed Price: <span className="font-bold">200 EGP</span></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                {isPaymentComplete ? (
                  <div className="flex flex-col items-center p-4 space-y-3 text-center bg-green-50 rounded-lg">
                    <div className="p-2 rounded-full bg-green-100">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-green-800">Payment Complete</h3>
                    <p className="text-sm text-green-600">
                      Thank you for using 24h App
                    </p>
                  </div>
                ) : (
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="vodafone">Vodafone Cash</TabsTrigger>
                      <TabsTrigger value="instapay">InstaPay</TabsTrigger>
                      <TabsTrigger value="cash">Cash</TabsTrigger>
                    </TabsList>
                    <TabsContent value="vodafone" className="space-y-4">
                      <p className="p-3 my-4 text-center font-medium rounded-lg bg-accent">
                        Send to: 010 1234 5678
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transaction Number</label>
                        <Input
                          value={transactionNumber}
                          onChange={(e) => setTransactionNumber(e.target.value)}
                          placeholder="Enter transaction number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (EGP)</label>
                        <Input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                          placeholder="Enter amount"
                        />
                      </div>
                      <Button
                        onClick={() => {}}
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Screenshot
                      </Button>
                    </TabsContent>
                    <TabsContent value="instapay" className="space-y-4">
                      <p className="p-3 my-4 text-center font-medium rounded-lg bg-accent">
                        Send to: 01 2345 6789 - Name: 24h App
                      </p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transaction Number</label>
                        <Input
                          value={transactionNumber}
                          onChange={(e) => setTransactionNumber(e.target.value)}
                          placeholder="Enter transaction number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (EGP)</label>
                        <Input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                          placeholder="Enter amount"
                        />
                      </div>
                      <Button
                        onClick={() => {}}
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Screenshot
                      </Button>
                    </TabsContent>
                    <TabsContent value="cash" className="py-4">
                      <p className="text-center">
                        You will pay directly to the nurse after the service is complete.
                      </p>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              {!isPaymentComplete && (
                <CardFooter>
                  <Button 
                    onClick={handlePayment} 
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 rounded-full border-t-transparent animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Payment Done"
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackRequest;
