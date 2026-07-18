"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(
  null
);

function useDropdownMenuContext() {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu compound components must be used within DropdownMenu");
  return ctx;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  { asChild?: boolean; children: React.ReactNode; className?: string }
>(({ children, asChild, ...props }, ref) => {
  const { open, setOpen } = useDropdownMenuContext();
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" }
>(({ className, children, align = "end", ...props }, ref) => {
  const { open, setOpen } = useDropdownMenuContext();
  const internalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        internalRef.current &&
        !internalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  if (!open) return null;

  const alignClass =
    align === "end"
      ? "right-0"
      : align === "start"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-lg",
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, asChild, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: React.MouseEventHandler }).onClick?.(e);
        setOpen(false);
      },
    });
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-zinc-300 outline-none hover:bg-zinc-800 focus:bg-zinc-800",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-zinc-700", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
