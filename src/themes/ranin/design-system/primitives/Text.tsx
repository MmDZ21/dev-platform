import { ReactNode } from "react";
import clsx from "clsx";

export interface TextProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
}

export function Text({ as = "p", className, children }: TextProps) {
  const Tag = as as any;
  return <Tag className={clsx("text-gray-700", className)}>{children}</Tag>;
}


