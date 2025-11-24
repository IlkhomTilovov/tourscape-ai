import { Skeleton } from "@/components/ui/skeleton";

export const DestinationCardSkeleton = () => (
  <div className="card-elevated rounded-xl overflow-hidden bg-card">
    <Skeleton className="h-64 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const TourCardSkeleton = () => (
  <div className="card-elevated rounded-xl overflow-hidden bg-card">
    <Skeleton className="h-56 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="relative h-64 rounded-2xl overflow-hidden">
    <Skeleton className="absolute inset-0" />
  </div>
);
