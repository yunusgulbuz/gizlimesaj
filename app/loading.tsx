"use client";

import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">birmesajmutluluk</span>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton variant="shimmer" className="hidden md:block h-4 w-16" />
              <Skeleton variant="shimmer" className="hidden md:block h-4 w-16" />
              <Skeleton variant="gradient" className="h-10 w-24 rounded-lg" />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-rose-50/50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <Skeleton variant="gradient" className="h-8 w-64 mx-auto rounded-full" />
              <div className="space-y-4">
                <Skeleton variant="shimmer" className="h-12 md:h-14 w-full max-w-2xl mx-auto" />
                <Skeleton variant="shimmer" className="h-12 md:h-14 w-4/5 max-w-xl mx-auto" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="default" className="h-6 w-full max-w-lg mx-auto" />
                <Skeleton variant="default" className="h-6 w-3/4 max-w-md mx-auto" />
              </div>

              {/* Quick Steps */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 pt-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-1.5 sm:gap-2">
                    <Skeleton variant="gradient" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
                    <Skeleton variant="shimmer" className="h-4 w-16 sm:w-20" />
                    {step < 3 && <Skeleton variant="default" className="h-3 w-3 sm:w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products - Popüler Hediyeler */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <Skeleton variant="gradient" className="h-8 w-48 mb-2" />
                <Skeleton variant="default" className="h-5 w-64" />
              </div>
              <Skeleton variant="shimmer" className="h-10 w-32 rounded-lg" />
            </div>

            {/* 8 Product Cards - E-ticaret tarzı */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="group relative h-full overflow-hidden rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100"
                >
                  {/* Image - 4:3 aspect ratio */}
                  <Skeleton variant="gradient" className="w-full aspect-[4/3]" />

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <Skeleton variant="shimmer" className="h-5 w-3/4" />

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} variant="default" className="h-3.5 w-3.5 rounded-full" />
                        ))}
                      </div>
                      <Skeleton variant="default" className="h-3 w-8 ml-1" />
                      <Skeleton variant="default" className="h-3 w-12" />
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <Skeleton variant="gradient" className="h-8 w-20" />
                      <Skeleton variant="default" className="h-4 w-16" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <Skeleton variant="shimmer" className="h-4 w-20" />
                      <div className="h-4 w-px bg-gray-200" />
                      <Skeleton variant="shimmer" className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-gray-100 bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} variant="shimmer" className="h-9 w-20 rounded-full" />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Skeleton variant="gradient" className="h-12 w-full sm:w-48 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Loading Message */}
        <div className="py-12 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Hediyeler hazırlanıyor...</p>
        </div>
      </main>
    </div>
  );
}
