import { ReactNode } from "react";
import clsx from "clsx";

type AnchorProps = {
  href: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type NativeButtonProps = {
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = (AnchorProps | NativeButtonProps) & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md" } = props as ButtonProps;
  const className = (props as any).className as string | undefined;
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-95 focus-visible:ring-ring",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-95 focus-visible:ring-ring",
    ghost: "bg-transparent text-foreground hover:bg-muted focus-visible:ring-ring",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const classes = clsx(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { children, href, ...rest } = props as AnchorProps & { variant?: string; size?: string };
    return (
      <a href={href} className={classes} {...(rest as any)}>
        {children}
      </a>
    );
  }

  const { children, ...rest } = props as NativeButtonProps & { variant?: string; size?: string };
  return (
    <button className={classes} {...(rest as any)}>
      {children}
    </button>
  );
}


