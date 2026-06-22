import { HTMLAttributes } from 'react'
import { Card } from './card'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

export function Skeleton({ className = '', width, height, style, ...props }: SkeletonProps) {
  return (
    <div 
      className={`bg-border/60 animate-pulse rounded-lg ${className}`}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <Card padding="md">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </Card>
  )
}
