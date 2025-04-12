import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-cyber-blue disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-cyber-gray text-white hover:bg-cyber-light border border-cyber-blue shadow-cyber",
        primary: "bg-cyber-blue text-white hover:bg-cyber-blue-dark shadow-cyber",
        secondary: "bg-cyber-purple text-white hover:bg-cyber-purple-light shadow-cyber",
        success: "bg-cyber-green text-cyber-black hover:opacity-90 shadow-cyber",
        warning: "bg-cyber-yellow text-cyber-black hover:opacity-90 shadow-cyber",
        danger: "bg-cyber-red text-white hover:opacity-90 shadow-cyber",
        outline: "bg-transparent border border-cyber-blue text-cyber-blue hover:bg-cyber-gray",
        ghost: "bg-transparent text-cyber-blue hover:bg-cyber-gray hover:text-cyber-blue-dark",
        link: "bg-transparent text-cyber-blue underline-offset-4 hover:underline",
        glow: "bg-cyber-dark text-cyber-blue border border-cyber-blue animate-cyber-pulse hover:text-white",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 rounded-md",
        lg: "h-12 px-8 rounded-md text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  className,
  variant,
  size,
  onClick,
  label,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
