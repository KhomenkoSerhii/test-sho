import { cn } from "@/lib/utils";

export function CatalogSkeleton() {
  return (
    <div className="grid auto-rows-[220px] grid-cols-1 gap-5 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-2xl bg-paper-raised",
            i === 0 ? "md:col-span-2 md:row-span-2" : ""
          )}
        />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-paper-raised" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-paper-raised" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-paper-raised" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-paper-raised" />
        <div className="mt-6 h-32 animate-pulse rounded bg-paper-raised" />
      </div>
    </div>
  );
}
