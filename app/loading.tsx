export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="h-12 bg-border/50 rounded-xl animate-pulse"></div>
        <div className="h-32 bg-border/50 rounded-2xl animate-pulse"></div>
        <div className="h-12 bg-border/50 rounded-xl animate-pulse w-3/4 mx-auto"></div>
      </div>
    </div>
  )
}
