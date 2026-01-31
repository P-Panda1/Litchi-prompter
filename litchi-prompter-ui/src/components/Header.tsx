import LycheeIcon from "./LycheeIcon";

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <LycheeIcon className="w-10 h-10 transition-transform duration-300 hover:scale-110 hover:animate-bounce" />
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground tracking-tight">
              LitchiPrompter
            </h1>
            <p className="text-xs text-muted-foreground">
              Turn confusion into clarity
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
