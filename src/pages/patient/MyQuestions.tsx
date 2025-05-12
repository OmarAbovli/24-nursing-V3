
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const MyQuestions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [questions] = useState([
    {
      id: 'q1',
      title: 'Blood pressure medications',
      description: 'I\'m taking amlodipine and experiencing swollen ankles. Is this normal?',
      status: 'answered',
      date: '2025-05-05',
      answer: 'Swelling in the ankles is a common side effect of amlodipine. If it\'s bothersome, please consult with your doctor about alternative medications.'
    },
    {
      id: 'q2',
      title: 'Persistent headache',
      description: 'I\'ve been having headaches almost daily for the past two weeks. Should I be concerned?',
      status: 'pending',
      date: '2025-05-08',
      answer: null
    }
  ]);

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
        <h1 className="text-lg font-semibold text-foreground">{t("My Questions")}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/patient/ask-question")}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </header>

      <main className="container px-4 py-6">
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-foreground">{question.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${question.status === 'answered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                      {question.status === 'answered' ? t("Answered") : t("Pending")}
                    </span>
                  </div>
                  <CardDescription>{question.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{question.description}</p>
                  {question.answer && (
                    <div className="bg-muted p-3 rounded-lg">
                      <h4 className="font-medium text-foreground mb-1">{t("Doctor's Answer")}</h4>
                      <p className="text-sm text-muted-foreground">{question.answer}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/patient/question/${question.id}`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {question.status === 'answered' ? t("View Details") : t("Check Status")}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">{t("No questions yet")}</h3>
              <p className="text-muted-foreground mb-4">{t("You haven't asked any medical questions yet")}</p>
              <Button onClick={() => navigate("/patient/ask-question")}>
                {t("Ask Your First Question")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyQuestions;
