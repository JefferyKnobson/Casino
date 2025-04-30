import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ButtonHTMLAttributes } from "react";

const casinoButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gold: "bg-amber-500 text-black hover:bg-amber-400 font-bold border border-amber-700 shadow-md",
        red: "bg-red-600 text-white hover:bg-red-500 font-bold border border-red-800 shadow-md",
        green: "bg-green-600 text-white hover:bg-green-500 font-bold border border-green-800 shadow-md",
        blue: "bg-blue-600 text-white hover:bg-blue-500 font-bold border border-blue-800 shadow-md",
        purple: "bg-purple-600 text-white hover:bg-purple-500 font-bold border border-purple-800 shadow-md",
        chip: "rounded-full w-16 h-16 text-base font-bold shadow-lg border-2 transform transition-transform hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        md: "h-10 px-5 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md",
        xl: "h-12 px-10 rounded-md text-base",
        icon: "h-10 w-10",
        chip: "h-16 w-16 rounded-full p-0",
      },
      chipValue: {
        1: "bg-white text-slate-800 border-slate-300",
        5: "bg-red-600 text-white border-red-800",
        10: "bg-blue-600 text-white border-blue-800",
        25: "bg-green-600 text-white border-green-800",
        50: "bg-purple-700 text-white border-purple-900",
        100: "bg-amber-500 text-black border-amber-700",
        500: "bg-zinc-800 text-white border-zinc-900",
        1000: "bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CasinoButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof casinoButtonVariants> {
  chipValue?: 1 | 5 | 10 | 25 | 50 | 100 | 500 | 1000;
}

const CasinoButton = forwardRef<HTMLButtonElement, CasinoButtonProps>(
  ({ className, variant, size, chipValue, ...props }, ref) => {
    return (
      <button
        className={cn(casinoButtonVariants({ variant, size, chipValue }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CasinoButton.displayName = "CasinoButton";

export { CasinoButton, casinoButtonVariants };
