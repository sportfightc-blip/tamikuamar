import Image from "next/image";
import { cn } from "@/lib/cn";
import { withBasePath } from "@/lib/basePath";

export function Logo({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={withBasePath("/logo-mark.png")}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      priority
    />
  );
}
