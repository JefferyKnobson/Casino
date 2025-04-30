import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

interface CasinoCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: "gold" | "red" | "green" | "blue" | "purple" | "default";
  bordered?: boolean;
  elevated?: boolean;
}

const CasinoCard = forwardRef<HTMLDivElement, CasinoCardProps>(
  ({ className, gradient = "default", bordered = false, elevated = false, ...props }, ref) => {
    const gradientClasses = {
      gold: "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
      red: "bg-gradient-to-br from-red-100 to-red-50 border-red-300",
      green: "bg-gradient-to-br from-green-100 to-green-50 border-green-300",
      blue: "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300",
      purple: "bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300",
      default: "bg-card text-card-foreground",
    };

    return (
      <Card
        ref={ref}
        className={cn(
          gradientClasses[gradient],
          bordered && "border-2",
          elevated && "shadow-lg",
          className
        )}
        {...props}
      />
    );
  }
);
CasinoCard.displayName = "CasinoCard";

const CasinoCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("pb-2", className)} {...props} />
));
CasinoCardHeader.displayName = "CasinoCardHeader";

const CasinoCardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle ref={ref} className={cn("text-xl font-bold", className)} {...props} />
));
CasinoCardTitle.displayName = "CasinoCardTitle";

const CasinoCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription ref={ref} className={cn("text-muted-foreground", className)} {...props} />
));
CasinoCardDescription.displayName = "CasinoCardDescription";

const CasinoCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("pt-0", className)} {...props} />
));
CasinoCardContent.displayName = "CasinoCardContent";

const CasinoCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn("flex items-center pt-1", className)} {...props} />
));
CasinoCardFooter.displayName = "CasinoCardFooter";

export {
  CasinoCard,
  CasinoCardHeader,
  CasinoCardTitle,
  CasinoCardDescription,
  CasinoCardContent,
  CasinoCardFooter,
};
