import { forwardRef, PropsWithChildren } from "react";
import { cn } from "../../../../utils";
import { LoadingBlock } from "../LoadingBlock/LoadingBlock";

interface BadgeItem {
  badgeContent: React.ReactNode;
  badgeColor: "green" | "gray" | "yellow" | "white";
}

type Props = PropsWithChildren & {
  className?: string;
  innerClassName?: string;
  isLoading?: boolean;
  title?: string;
  titleChildren?: React.ReactNode;
  badges?: BadgeItem[];
};

export const CardBase = forwardRef<HTMLDivElement, Props>(function Card(
  {
    children,
    className,
    innerClassName,
    isLoading,
    title,
    titleChildren = null,
    badges,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "relative",
        "rounded-md border-2 border-gray-800 bg-white",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 bg-slate-100 rounded-t-md border-b border-slate-200">
          <div className="border-r bg-slate-50 p-2 pl-4 text-sm rounded-tl-md font-bold uppercase">
            {title}
          </div>
          {titleChildren}
        </div>
      )}
      {badges && (
        <div className="flex justify-center items-center gap-1 absolute left-0 right-0 top-0 mx-auto -translate-y-[50%]">
          {badges.map(({ badgeColor, badgeContent }, index) => (
            <div
              key={index}
              className={cn(
                "flex justify-center items-center border-2 border-gray-800 rounded-3xl px-2 py-1",
                {
                  "bg-green-300": badgeColor === "green",
                  "bg-white": badgeColor === "white",
                  "bg-yellow-300": badgeColor === "yellow",
                }
              )}
            >
              <div className="-mb-[1px]">{badgeContent}</div>
            </div>
          ))}
        </div>
      )}
      <div className={cn("p-4", innerClassName)}>{children}</div>
      <div
        className={cn(
          "absolute top-0 bottom-0 left-0 right-0",
          "flex items-center justify-center",
          "bg-white opacity-0 rounded-3xl z-10 pointer-events-none",
          "transition-opacity duration-300",
          { "opacity-100 pointer-events-auto": isLoading }
        )}
      >
        <LoadingBlock />
      </div>
    </div>
  );
});
