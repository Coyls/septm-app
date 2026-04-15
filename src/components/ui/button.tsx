import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap",
    "rounded-xl border text-sm font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
    "outline-none select-none cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:border-destructive/40 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-primary/80 bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:border-primary hover:bg-primary/92",
          "active:bg-primary/88",
        ].join(" "),
        outline: [
          "border-border bg-card text-foreground",
          "shadow-xs",
          "hover:border-foreground/15 hover:bg-muted",
          "active:bg-muted/80",
        ].join(" "),
        secondary: [
          "border-transparent bg-secondary text-secondary-foreground",
          "hover:bg-secondary/85",
          "active:bg-secondary/75",
        ].join(" "),
        ghost: [
          "border-transparent bg-transparent text-foreground/75",
          "hover:bg-muted hover:text-foreground",
          "active:bg-muted/80",
        ].join(" "),
        destructive: [
          "border-destructive/15 bg-destructive text-destructive-foreground",
          "shadow-sm",
          "hover:bg-destructive/92",
          "active:bg-destructive/88",
          "focus-visible:ring-destructive/30",
        ].join(" "),
        link: [
          "border-transparent bg-transparent px-0 shadow-none",
          "text-primary underline-offset-4 hover:underline",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
        ].join(" "),
      },
      size: {
        default:
          "h-10 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1.5 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
