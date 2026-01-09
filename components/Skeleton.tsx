/**
 * Skeleton loading placeholder components
 * @module components/Skeleton
 * @description Animated placeholder components for loading states
 */

/** Props for the base Skeleton component */
interface SkeletonProps {
  /** Additional CSS classes for sizing/styling */
  className?: string;
}

/**
 * Base skeleton loading placeholder
 *
 * @description
 * Animated gray rectangle for content loading states.
 * Hidden from screen readers with aria-hidden.
 *
 * @example
 * ```tsx
 * // Custom sized skeleton
 * <Skeleton className="h-8 w-32" />
 *
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @returns Animated placeholder element
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Multi-line text skeleton placeholder
 *
 * @description
 * Renders multiple skeleton lines for paragraph loading states.
 * Last line is shorter (75% width) for natural text appearance.
 *
 * @example
 * ```tsx
 * // Single line
 * <SkeletonText />
 *
 * // Paragraph placeholder
 * <SkeletonText lines={4} />
 * ```
 *
 * @param props - Component props
 * @param props.lines - Number of skeleton lines to render (default: 1)
 * @returns Stack of skeleton line elements
 */
export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton placeholder
 *
 * @description
 * Pre-composed skeleton for card-style content with:
 * - Title placeholder (1/3 width)
 * - 3 lines of body text
 *
 * @example
 * ```tsx
 * // Loading state for card list
 * {isLoading ? (
 *   <SkeletonCard />
 * ) : (
 *   <ActualCard data={data} />
 * )}
 * ```
 *
 * @returns Card-shaped skeleton element
 */
export function SkeletonCard() {
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4"
      aria-hidden="true"
    >
      <Skeleton className="mb-4 h-6 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  );
}
