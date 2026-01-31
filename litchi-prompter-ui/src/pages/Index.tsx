import { useState } from "react";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";
import ClarifyingQuestions from "@/components/ClarifyingQuestions";
import PromptOutput from "@/components/PromptOutput";
import LoadingState from "@/components/LoadingState";

type AppState = "input" | "clarifying" | "loading" | "output";

interface Question {
  id: string;
  text: string;
  placeholder: string;
}

interface Result {
  goal: string;
  thinkingSteps: string[];
  sentenceStarters: string[];
  explanation: string;
}

// Simulated logic - in production, this would call an AI service
const needsClarification = (prompt: string): boolean => {
  const vaguePatterns = [
    /create a (website|page|app)/i,
    /design a/i,
    /build a/i,
    /make a/i,
  ];
  return vaguePatterns.some((pattern) => pattern.test(prompt));
};

const getClarifyingQuestions = (prompt: string): Question[] => {
  if (/landing page|website|page/i.test(prompt)) {
    return [
      {
        id: "user",
        text: "Who is the user?",
        placeholder: "Example: Students, parents, small business owners...",
      },
      {
        id: "problem",
        text: "What problem do they have?",
        placeholder: "Example: They need to find information quickly...",
      },
      {
        id: "feeling",
        text: "What should the user feel?",
        placeholder: "Example: Confident, excited, informed...",
      },
      {
        id: "action",
        text: "What action should be easy to take?",
        placeholder: "Example: Sign up, contact us, learn more...",
      },
    ];
  }
  return [
    {
      id: "context",
      text: "What is the context for this task?",
      placeholder: "Example: A school assignment, work project...",
    },
    {
      id: "audience",
      text: "Who will read or see this?",
      placeholder: "Example: My teacher, classmates, clients...",
    },
    {
      id: "constraints",
      text: "Are there any requirements or limits?",
      placeholder: "Example: Word count, format, deadline...",
    },
  ];
};

const generateResult = (prompt: string, answers?: Record<string, string>): Result => {
  // Simulated results based on prompt type
  if (/reflection|project|learned/i.test(prompt)) {
    return {
      goal: "You will explain what you built and what you learned from the experience.",
      thinkingSteps: [
        "What did you build or create?",
        "What was the most difficult part?",
        "What did you learn from this experience?",
        "What would you do differently next time?",
      ],
      sentenceStarters: [
        "My project is about...",
        "One challenge I had was...",
        "I learned that...",
        "Next time, I would...",
      ],
      explanation:
        "The language was simplified and broken into clear steps. The word 'reflection' was explained with specific questions to guide your thinking.",
    };
  }

  if (/landing page|website|product/i.test(prompt) && answers) {
    return {
      goal: `You will create a page that helps ${answers.user || "your users"} understand how to solve ${answers.problem || "their problem"} and feel ${answers.feeling || "confident"} about taking action.`,
      thinkingSteps: [
        `Define who your user is: ${answers.user || "your target audience"}`,
        `Explain the problem clearly: ${answers.problem || "the challenge they face"}`,
        "Show how your product or service helps",
        `Make it easy to: ${answers.action || "take the next step"}`,
        "Use simple words and clear visuals",
      ],
      sentenceStarters: [
        "The main problem we solve is...",
        "Our users need...",
        "With this product, you can...",
        "The next step is to...",
      ],
      explanation:
        "Your prompt was vague, so we asked questions to understand your goals. Now we have clear steps for planning your page design.",
    };
  }

  if (/compare|contrast/i.test(prompt)) {
    return {
      goal: "You will show how two things are similar and different, and explain why this matters.",
      thinkingSteps: [
        "What are the two things you are comparing?",
        "List 2-3 ways they are similar",
        "List 2-3 ways they are different",
        "Explain which differences are most important",
        "Say what we can learn from this comparison",
      ],
      sentenceStarters: [
        "Both of these...",
        "One difference is that...",
        "The most important similarity is...",
        "This comparison shows us that...",
      ],
      explanation:
        "The task was broken down into specific thinking steps. Compare and contrast means finding both similarities and differences.",
    };
  }

  // Default response
  return {
    goal: "You will complete this task step by step, making sure you understand each part before moving forward.",
    thinkingSteps: [
      "Read the prompt carefully. What is being asked?",
      "What information do you already have?",
      "What information do you need to find or think about?",
      "Plan your response before writing",
      "Check your work against the original prompt",
    ],
    sentenceStarters: [
      "The task is asking me to...",
      "I already know that...",
      "I need to find out...",
      "My plan is to...",
    ],
    explanation:
      "We created general thinking steps to help you approach any task. Take your time with each step.",
  };
};

const Index = () => {
  const [state, setState] = useState<AppState>("input");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const handlePromptSubmit = (prompt: string) => {
    setOriginalPrompt(prompt);

    if (needsClarification(prompt)) {
      setQuestions(getClarifyingQuestions(prompt));
      setState("clarifying");
    } else {
      setState("loading");
      // Simulate API call
      setTimeout(() => {
        setResult(generateResult(prompt));
        setState("output");
      }, 1500);
    }
  };

  const handleQuestionsSubmit = (answers: Record<string, string>) => {
    setState("loading");
    // Simulate API call
    setTimeout(() => {
      setResult(generateResult(originalPrompt, answers));
      setState("output");
    }, 1500);
  };

  const handleBack = () => {
    setState("input");
    setQuestions([]);
  };

  const handleReset = () => {
    setState("input");
    setOriginalPrompt("");
    setQuestions([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-2xl mx-auto px-4 py-8 md:py-12">
        {state === "input" && (
          <PromptInput onSubmit={handlePromptSubmit} />
        )}

        {state === "clarifying" && (
          <ClarifyingQuestions
            questions={questions}
            onSubmit={handleQuestionsSubmit}
            onBack={handleBack}
            originalPrompt={originalPrompt}
          />
        )}

        {state === "loading" && <LoadingState />}

        {state === "output" && result && (
          <PromptOutput result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            LitchiPrompter helps you understand tasks clearly.{" "}
            <span className="text-foreground">No answers given — just better thinking.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
