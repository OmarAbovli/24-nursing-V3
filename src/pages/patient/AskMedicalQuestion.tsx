
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

const AskMedicalQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be connected to an actual API in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Question submitted",
        description: "Your question has been sent to our medical team.",
      });
      
      navigate("/patient/my-questions");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Submission failed",
        description: "Could not submit your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/patient/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{t("Ask a Medical Question")}</h1>
        <div className="w-8" /> {/* Placeholder for alignment */}
      </header>

      <main className="container px-4 py-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("Question Title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("Enter a brief title for your question")}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t("Question Description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("Provide details about your medical question or concern...")}
              className="min-h-[150px]"
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
              t("Submit Question")
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AskMedicalQuestion;
