"use client";

import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-rose-100/70 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                birmesajmutluluk
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="hidden h-4 w-16 rounded-full bg-rose-100 sm:block" />
              <Skeleton className="hidden h-4 w-16 rounded-full bg-rose-100 md:block" />
              <Skeleton className="h-9 w-24 rounded-full bg-rose-100" />
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-br from-white via-rose-50 to-sky-50">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_60%)]" />

          <div className="container relative mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
              {/* Desktop preview placeholder */}
              <div className="relative hidden lg:block lg:order-2">
                <div className="absolute -left-10 top-6 hidden h-40 w-40 rounded-full bg-rose-200/40 blur-3xl lg:block" />
                <div className="absolute -right-10 bottom-10 hidden h-48 w-48 rounded-full bg-sky-200/50 blur-3xl lg:block" />
                <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-2xl shadow-rose-200/60 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <Skeleton className="h-6 w-28 rounded-full bg-emerald-100/70" />
                    <Skeleton className="h-5 w-24 rounded-full bg-rose-100/70" />
                  </div>
                  <Skeleton className="mt-5 aspect-[4/3] w-full rounded-2xl bg-rose-100/60" />
                  <Skeleton className="mt-5 h-20 w-full rounded-2xl bg-rose-50" />
                </div>
              </div>

              {/* Messaging skeleton */}
              <div className="flex flex-col gap-6 lg:order-1">
                <Skeleton className="h-8 w-56 rounded-full bg-rose-100" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-72 rounded-2xl bg-rose-100/80 sm:w-96 lg:w-[28rem]" />
                  <Skeleton className="h-12 w-56 rounded-2xl bg-rose-100/80 sm:w-80" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full max-w-xl rounded-full bg-slate-200/80" />
                  <Skeleton className="h-5 w-3/4 max-w-lg rounded-full bg-slate-200/80" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Skeleton className="h-11 w-full rounded-full bg-gradient-to-r from-rose-200 to-amber-200 sm:w-44" />
                  <Skeleton className="h-11 w-full rounded-full border border-rose-100 bg-white sm:w-44" />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      className="h-8 rounded-full border border-rose-100 bg-white/90"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      className="rounded-2xl border border-white/60 bg-white/90 p-6"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 rounded-full bg-rose-100" />
                <Skeleton className="h-5 w-64 rounded-full bg-slate-200/80" />
              </div>
              <Skeleton className="h-11 w-36 rounded-full border border-rose-100 bg-white" />
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-rose-100 bg-white p-0 shadow-lg shadow-rose-100/70"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-3xl rounded-b-none bg-rose-100/70" />
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-5 w-3/4 rounded-full bg-slate-200/80" />
                    <Skeleton className="h-3 w-24 rounded-full bg-slate-200/70" />
                    <Skeleton className="h-7 w-28 rounded-full bg-rose-100" />
                    <div className="flex items-center justify-between border-t border-rose-100 pt-4">
                      <Skeleton className="h-4 w-20 rounded-full bg-rose-100/80" />
                      <Skeleton className="h-8 w-24 rounded-full border border-rose-100 bg-rose-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-[32px] border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                <Skeleton className="h-6 w-44 rounded-full bg-slate-200/80" />
                <Skeleton className="h-5 w-32 rounded-full bg-rose-100/80" />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    className="h-9 w-24 rounded-full border border-rose-100 bg-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="relative py-20 bg-gradient-to-br from-rose-50 via-white to-sky-50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-7 w-52 rounded-full bg-slate-200/80" />
            <Skeleton className="mt-3 h-4 w-64 rounded-full bg-slate-200/70" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/60"
                >
                  <Skeleton className="h-12 w-12 rounded-2xl bg-rose-100" />
                  <Skeleton className="mt-6 h-5 w-48 rounded-full bg-slate-200/80" />
                  <Skeleton className="mt-3 h-4 w-56 rounded-full bg-slate-200/70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-7 w-56 rounded-full bg-slate-200/80" />
            <Skeleton className="mt-3 h-4 w-64 rounded-full bg-slate-200/70" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/40"
                >
                  <Skeleton className="h-20 w-full rounded-2xl bg-rose-100/60" />
                  <div className="mt-6 flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full bg-rose-100/80" />
                    <Skeleton className="h-4 w-32 rounded-full bg-slate-200/80" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-400 via-purple-400 to-amber-300 opacity-80" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_60%)]" />
          <div className="container relative mx-auto px-4 text-center text-white">
            <Skeleton className="mx-auto h-10 w-72 rounded-full bg-white/40" />
            <Skeleton className="mx-auto mt-4 h-5 w-56 rounded-full bg-white/30" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Skeleton className="h-11 w-full rounded-full bg-white/60 sm:w-44" />
              <Skeleton className="h-11 w-full rounded-full border border-white/50 sm:w-56" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
