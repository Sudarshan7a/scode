import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 dark:bg-muted/20",
        className
      )}
    />
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonUserInfo() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SkeletonButton() {
  return <Skeleton className="h-10 w-24 rounded-md" />;
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner Skeleton */}
      <div className="space-y-4 p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="space-y-4 p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonButton />
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>

      {/* Rooms Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <SkeletonList count={4} />
      </div>
    </div>
  );
}
