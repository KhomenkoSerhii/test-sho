import { CatalogSkeleton } from "@/components/states/skeletons";

export default function CatalogLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="h-10 w-64 animate-pulse rounded bg-paper-raised" />
      <div className="h-16 animate-pulse rounded bg-paper-raised" />
      <CatalogSkeleton />
    </div>
  );
}
