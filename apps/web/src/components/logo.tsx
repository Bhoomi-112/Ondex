import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Image sizing */
  imgClassName?: string;
  priority?: boolean;
  /** @deprecated */
  withWordmark?: boolean;
  /** @deprecated */
  markClassName?: string;
  /** @deprecated */
  wordmarkClassName?: string;
};

/**
 * Primary brand mark — favicon pack photo (`/logo.png`).
 * Full SVG wordmark lives at `/logo-wordmark.svg` if needed elsewhere.
 */
export function Logo({ className, imgClassName, markClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Ondex"
        width={32}
        height={32}
        className={cn(
          "h-8 w-8 rounded-md object-contain",
          markClassName,
          imgClassName,
        )}
        decoding="async"
      />
    </span>
  );
}

/** Larger logo for hero / empty states */
export function LogoHero({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Ondex"
      width={160}
      height={160}
      className={cn("h-auto w-full max-w-[160px] rounded-2xl object-contain", className)}
      decoding="async"
    />
  );
}
