import { Button } from "@/components/ui/button";
import { Target, ListOrdered, MessageSquareQuote, FileText, ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PromptOutputProps {
  result: {
    goal: string;
    thinkingSteps: string[];
    sentenceStarters: string[];
    explanation: string;
  };
  onReset: () => void;
}

const PromptOutput = ({ result, onReset }: PromptOutputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const text = `CLEAR GOAL:\n${result.goal}\n\nTHINKING STEPS:\n${result.thinkingSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nSENTENCE STARTERS:\n${result.sentenceStarters.map((s) => `• ${s}`).join("\n")}\n\nWHAT CHANGED:\n${result.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
            Here is your breakdown
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Use these steps to approach your task with confidence.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopyAll}>
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy all
            </>
          )}
        </Button>
      </div>

      {/* Clear Goal */}
      <section className="p-5 rounded-xl bg-card border-2 border-primary/20 shadow-card">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Clear Goal</h3>
        </div>
        <p className="text-foreground text-lg leading-relaxed">{result.goal}</p>
      </section>

      {/* Thinking Steps */}
      <section className="p-5 rounded-xl bg-card border-2 border-border shadow-soft">
        <div className="flex items-center gap-2 text-foreground mb-4">
          <ListOrdered className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Thinking Steps</h3>
        </div>
        <ol className="space-y-3">
          {result.thinkingSteps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sentence Starters */}
      <section className="p-5 rounded-xl bg-card border-2 border-border shadow-soft">
        <div className="flex items-center gap-2 text-foreground mb-4">
          <MessageSquareQuote className="w-5 h-5 text-accent-foreground" />
          <h3 className="font-semibold">Sentence Starters</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-3">
          Use these to begin your writing:
        </p>
        <ul className="space-y-2">
          {result.sentenceStarters.map((starter, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-accent/50"
            >
              <span className="w-2 h-2 rounded-full bg-accent-foreground flex-shrink-0" />
              <span className="text-foreground italic">"{starter}"</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Explanation */}
      <section className="p-5 rounded-xl bg-secondary/30 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <FileText className="w-4 h-4" />
          <h3 className="font-medium text-sm">What we changed</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {result.explanation}
        </p>
      </section>

      {/* Actions */}
      <div className="pt-4 border-t border-border">
        <Button variant="worksheet" onClick={onReset}>
          <ArrowLeft className="w-4 h-4" />
          Try another prompt
        </Button>
      </div>
    </div>
  );
};

export default PromptOutput;
