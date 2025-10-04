"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";

export default function TemplatesLoading() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      {/* Header - Normal app bar instead of skeleton */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">birmesajmutluluk</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Planlar
              </Link>
              <Link href="/about" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                Hakkımızda
              </Link>
              <Link href="/contact" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 md:block">
                İletişim
              </Link>
              <div className="hidden md:block">
                <HeaderAuthButton />
              </div>
              <MobileDrawerMenu user={null} />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Filters Section */}
        <section className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Skeleton variant="shimmer" className="h-10 w-full rounded-lg pl-10" />
              </div>

              {/* Sort Dropdown */}
              <Skeleton variant="gradient" className="h-10 w-40 rounded-lg" />
            </div>

            {/* Categories */}
            <div className="flex w-full gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="shimmer" className="h-8 w-20 rounded-full shrink-0" />
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid - E-ticaret tarzı */}
        <section className="container mx-auto px-4 pb-12">
          <div className="mb-4">
            <Skeleton variant="default" className="h-4 w-32" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
                  <div className="flex items-baseline gap-2">
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

          {/* Loading Message */}
          <div className="mt-12 text-center space-y-4">
            <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Şablonlar yükleniyor...</p>
          </div>
        </section>
      </main>
    </div>
  );
}
