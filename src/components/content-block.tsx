import { cn } from "@/lib/utils";

type ContentBlockProps = React.ComponentPropsWithoutRef<"div">;

export const ContentBlock = ({ children, className }: ContentBlockProps) => {
  return (
    <div
      className={cn(
        "h-full w-full overflow-hidden rounded-md bg-[#F7F8FA] shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};
