import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-8 sm:py-12 responsive-padding">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="h-10 w-48 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
