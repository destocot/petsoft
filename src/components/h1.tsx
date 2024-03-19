import { cn } from "@/lib/utils";

type H1Props = React.HTMLAttributes<HTMLHeadingElement>;

export const H1 = ({ children, className }: H1Props) => {
  return (
    <h1 className={cn("text-2xl font-medium leading-6", className)}>
      {children}
    </h1>
  );
};
