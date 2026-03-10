import * as React from "react";
import { cn } from "../../lib/utils";

// Heading enforces Serif font family for elegance
export function Heading({
  className,
  as: Component = "h1",
  variant = "h1",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: any;
  variant?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <Component
      className={cn(
        "font-serif tracking-tight text-foreground",
        {
          "text-4xl md:text-6xl font-black": variant === "h1",
          "text-3xl md:text-4xl font-bold": variant === "h2",
          "text-2xl md:text-3xl font-semibold": variant === "h3",
          "text-xl md:text-2xl font-medium": variant === "h4",
        },
        className,
      )}
      {...props}
    />
  );
}

// DataLabel enforces Sans font family for readability and data
export function DataLabel({
  className,
  as: Component = "p",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { as?: any }) {
  return (
    <Component
      className={cn(
        "font-sans text-sm md:text-base text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
