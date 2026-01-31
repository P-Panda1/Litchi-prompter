import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "relative overflow-hidden bg-primary text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.98] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_2px_at_20%_30%,rgba(255,255,255,0.35),transparent_50%),radial-gradient(circle_2.5px_at_60%_20%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_2px_at_80%_50%,rgba(255,255,255,0.28),transparent_50%),radial-gradient(circle_1.5px_at_40%_70%,rgba(255,255,255,0.32),transparent_50%),radial-gradient(circle_2px_at_15%_80%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_2.5px_at_90%_75%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_1.5px_at_50%_45%,rgba(255,255,255,0.22),transparent_50%),radial-gradient(circle_2px_at_70%_85%,rgba(255,255,255,0.28),transparent_50%)] before:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-br after:from-white/10 after:to-transparent after:pointer-events-none hover:after:bg-black/15 after:transition-colors after:duration-200",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border-2 border-input bg-background hover:bg-secondary hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow-md active:scale-[0.98]",
        worksheet: "bg-card border-2 border-border text-foreground hover:border-primary/40 hover:bg-secondary/50 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
