import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface Question {
  id: string;
  text: string;
  placeholder: string;
}

interface ClarifyingQuestionsProps {
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  onBack: () => void;
  originalPrompt: string;
}

const ClarifyingQuestions = ({
  questions,
  onSubmit,
  onBack,
  originalPrompt,
}: ClarifyingQuestionsProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  return (
    <div className="w-full animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Let's clarify a few things</span>
        </div>
        <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
          We need more information
        </h2>
        <p className="text-muted-foreground text-sm">
          Answer these questions to get better guidance for your task.
        </p>
      </div>

      {/* Original Prompt Reference */}
      <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground mb-1">Your original prompt:</p>
        <p className="text-sm text-foreground">{originalPrompt}</p>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="p-5 rounded-xl bg-card border-2 border-border shadow-soft"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <label className="block">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-foreground font-medium">{question.text}</span>
              </div>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none text-sm"
              />
            </label>
          </div>
        ))}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
          <Button type="submit" disabled={!allAnswered} className="flex-1 sm:flex-none">
            Continue with my answers
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClarifyingQuestions;
