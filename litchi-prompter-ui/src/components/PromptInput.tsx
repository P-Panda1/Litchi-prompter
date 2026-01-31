import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const examplePrompts = [
  "Write a reflection about your project and what you learned.",
  "Create a landing page for a product.",
  "Compare and contrast two historical events.",
  "Explain your problem-solving process.",
];

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Introduction */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
          What task do you need help understanding?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Paste your assignment, prompt, or task below. We will break it down into clear steps.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your prompt here...

For example:
• Write a reflection about your project
• Create a landing page for a product
• Compare two historical events"
            className="w-full min-h-[180px] p-5 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none shadow-soft"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!prompt.trim() || isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse-soft">Thinking...</span>
            </>
          ) : (
            <>
              Break it down
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Example Prompts */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">Try an example:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-sm px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border hover:border-primary/30 transition-all duration-200"
              disabled={isLoading}
            >
              {example.length > 40 ? example.slice(0, 40) + "..." : example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
