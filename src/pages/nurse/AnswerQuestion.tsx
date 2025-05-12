
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";

// Mock data for development
const mockQuestions = {
  'q1': {
    id: 'q1', 
    title: 'Diabetes Management', 
    description: 'How do I manage my diabetes with diet? I was recently diagnosed and I\'m struggling to understand what foods I should avoid.',
    patient: 'Ahmed Hassan',
    date: '2025-05-08'
  },
  'q2': {
    id: 'q2', 
    title: 'Blood Pressure', 
    description: 'What should I do about my high blood pressure? My last reading was 150/95.',
    patient: 'Sara Mahmoud',
    date: '2025-05-09'
  }
};

const AnswerQuestion = () => {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get question details from mock data or API
  const question = mockQuestions[questionId];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would connect to an actual API in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Answer submitted",
        description: "Your answer has been sent to the patient.",
      });
      
      navigate("/nurse/dashboard");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Submission failed",
        description: "Could not submit your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-foreground">{t("Question not found")}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/nurse/dashboard")}
            >
              {t("Back to Dashboard")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/nurse/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{t("Answer Question")}</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">{question.title}</CardTitle>
            <CardDescription>
              {t("From")}: {question.patient} • {question.date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{question.description}</p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">{t("Your Answer")}</h2>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("Provide your medical expertise and advice...")}
              className="min-h-[200px]"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 rounded-full border-t-transparent animate-spin" />
                {t("Submitting...")}
              </>
            ) : (
              t("Submit Answer")
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AnswerQuestion;
