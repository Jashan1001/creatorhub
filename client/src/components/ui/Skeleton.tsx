interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton = ({ className = "", width, height }: SkeletonProps) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCard = () => (
  <div className="bg-(--bg-surface) border border-(--border) rounded-lg p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        width={i === lines - 1 ? "60%" : "100%"}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 40 }: { size?: number }) => (
  <Skeleton
    className="rounded-full shrink-0"
    width={`${size}px`}
    height={`${size}px`}
  />
);