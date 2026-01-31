import LycheeIcon from "./LycheeIcon";

const LoadingState = () => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center animate-fade-in-up">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-soft">
          <LycheeIcon className="w-10 h-10" />
        </div>
        <div className="absolute -inset-4 rounded-3xl border-2 border-primary/20 animate-ping opacity-20" />
      </div>
      <h3 className="mt-6 font-serif text-lg font-semibold text-foreground">
        Breaking down your prompt...
      </h3>
      <p className="mt-2 text-muted-foreground text-sm text-center max-w-xs">
        We are simplifying the language and creating clear thinking steps for you.
      </p>
    </div>
  );
};

export default LoadingState;
