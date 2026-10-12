import React from "react";

export function Skeleton({ className = "", style }) {
  return <div className={`skeleton rounded-xl ${className}`} style={style} />;
}

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-3 w-32 mb-3" />
      <Skeleton className="h-9 w-72 mb-3" />
      <Skeleton className="h-3 w-96 max-w-full mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Skeleton className="h-64" /><Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
