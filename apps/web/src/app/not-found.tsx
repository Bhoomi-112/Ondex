import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[80px] font-serif font-medium text-text-muted leading-none">404</p>
      <h1 className="mt-4 text-xl font-semibold text-text-primary">Page not found</h1>
      <p className="mt-2 text-text-secondary max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
