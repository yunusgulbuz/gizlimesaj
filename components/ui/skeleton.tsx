import { cn } from "@/lib/utils"

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "shimmer" | "gradient" | "pulse"
}) {
  const variants = {
    default: "animate-pulse rounded-md bg-rose-200/60 dark:bg-rose-800/60",
  shimmer: "relative overflow-hidden rounded-md bg-rose-200/60 dark:bg-rose-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-rose-300/30 before:to-transparent",
    gradient: "animate-pulse rounded-md bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-pink-900/20",
    pulse: "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
  }

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    />
  )
}

// Specialized skeleton components for common use cases
function SkeletonText({ 
  lines = 1, 
  className,
  variant = "shimmer"
}: { 
  lines?: number
  className?: string
  variant?: "default" | "shimmer" | "gradient" | "pulse"
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton variant="gradient" className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton variant="shimmer" className="h-4 w-3/4" />
        <Skeleton variant="shimmer" className="h-4 w-1/2" />
      </div>
    </div>
  )
}

function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton 
      variant="gradient" 
      className={cn("h-10 w-24 rounded-lg", className)} 
    />
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonButton }