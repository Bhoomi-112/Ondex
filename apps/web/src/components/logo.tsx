import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

export function Logo({ className, imgClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/logo.png"
        alt="Ondex"
        width={28}
        height={28}
        className={cn("h-7 w-7 rounded-md object-contain", imgClassName)}
        decoding="async"
      />
    </span>
  );
}
