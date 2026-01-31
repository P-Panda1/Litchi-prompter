import { useState } from "react";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";
import ClarifyingQuestions from "@/components/ClarifyingQuestions";
import PromptOutput from "@/components/PromptOutput";
import LoadingState from "@/components/LoadingState";
import { processChat, submitClarification, ApiError } from "@/lib/api";
import type { ChatResponse, ConversationState } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

type AppState = "input" | "clarifying" | "loading" | "output";

const Index = () => {
  const [state, setState] = useState<AppState>("input");
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setState("loading");

    try {
      const response = await processChat({
        user_prompt: prompt,
        state: null,
      });

      setChatResponse(response);
      setConversationState(response.state);

      if (response.state.state_type === "needs_clarification") {
        setState("clarifying");
      } else if (response.state.state_type === "final_output" && response.final_answer) {
        setState("output");
      } else {
        setState("input");
        toast({
          title: "Error",
          description: "Unexpected response from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      setState("input");
      if (error instanceof ApiError) {
        toast({
          title: "Error",
          description: error.detail || error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionsSubmit = async (answers: Record<string, string>) => {
    if (!conversationState || !chatResponse?.clarification) {
      return;
    }

    setIsLoading(true);
    setState("loading");

    try {
      // Convert answers object to array in the order of questions
      const answerArray = chatResponse.clarification.questions.map(
        (_, index) => {
          const questionId = `question-${index}`;
          return answers[questionId]?.trim() || "";
        }
      );

      // Validate all answers are provided
      if (answerArray.some(answer => !answer)) {
        toast({
          title: "Please answer all questions",
          description: "All questions must be answered before continuing.",
          variant: "destructive",
        });
        setState("clarifying");
        setIsLoading(false);
        return;
      }

      const response = await submitClarification({
        answers: answerArray,
        state: conversationState,
      });

      setChatResponse(response);
      setConversationState(response.state);

      if (response.state.state_type === "final_output" && response.final_answer) {
        setState("output");
      } else {
        setState("input");
        toast({
          title: "Error",
          description: "Unexpected response from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      setState("clarifying");
      if (error instanceof ApiError) {
        toast({
          title: "Error",
          description: error.detail || error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setState("input");
    setConversationState(null);
    setChatResponse(null);
  };

  const handleReset = () => {
    setState("input");
    setConversationState(null);
    setChatResponse(null);
  };

  // Convert API response to component format
  const getResult = () => {
    if (!chatResponse?.final_answer) return null;

    return {
      goal: chatResponse.final_answer.goal,
      thinkingSteps: chatResponse.final_answer.thinking_steps,
      sentenceStarters: chatResponse.final_answer.sentence_starters,
      explanation: chatResponse.improved_prompt?.corrections || "Your prompt was processed and improved.",
    };
  };

  // Convert API questions to component format
  const getQuestions = () => {
    if (!chatResponse?.clarification) return [];

    return chatResponse.clarification.questions.map((question, index) => ({
      id: `question-${index}`,
      text: question,
      placeholder: "Type your answer here...",
    }));
  };

  const getOriginalPrompt = () => {
    return chatResponse?.improved_prompt?.improved_prompt || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-2xl mx-auto px-4 py-8 md:py-12">
        {state === "input" && (
          <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
        )}

        {state === "clarifying" && chatResponse?.clarification && (
          <ClarifyingQuestions
            questions={getQuestions()}
            onSubmit={handleQuestionsSubmit}
            onBack={handleBack}
            originalPrompt={getOriginalPrompt()}
          />
        )}

        {state === "loading" && <LoadingState />}

        {state === "output" && getResult() && (
          <PromptOutput result={getResult()!} onReset={handleReset} />
        )}

        {/* Show improved prompt if available and not in output state */}
        {chatResponse?.improved_prompt && state !== "output" && state !== "loading" && (
          <div className="mt-6 p-5 rounded-xl bg-card border-2 border-primary/20 shadow-card">
            <div className="flex items-center gap-2 text-primary mb-3">
              <span className="text-sm font-medium">✨ Improved Prompt</span>
            </div>
            <p className="text-foreground mb-3">{chatResponse.improved_prompt.improved_prompt}</p>
            {chatResponse.improved_prompt.corrections && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  See what was improved
                </summary>
                <div className="mt-2 p-3 rounded-lg bg-secondary/50 text-sm text-muted-foreground whitespace-pre-wrap">
                  {chatResponse.improved_prompt.corrections}
                </div>
              </details>
            )}
          </div>
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
