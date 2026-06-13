import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[20rem] md:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 transition duration-200 hover:shadow-xl dark:border-card-border dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {header && <div className="flex-1">{header}</div>}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-1 font-sans font-bold text-neutral-700 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-sm font-normal text-neutral-500 dark:text-neutral-400">
          {description}
        </div>
      </div>
    </div>
  );
};
