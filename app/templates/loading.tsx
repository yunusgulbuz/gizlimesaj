"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import HeaderAuthButton from "@/components/auth/header-auth-button";
import { MobileDrawerMenu } from "@/components/mobile-drawer-menu";

export default function TemplatesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-slate-900">
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
              <div className="hidden md:block">
                <HeaderAuthButton />
              </div>
              <MobileDrawerMenu user={null} />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 py-8">
          <div className="rounded-[32px] border border-rose-100 bg-white/90 p-6 shadow-sm shadow-rose-100/60 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Skeleton className="h-11 w-full rounded-full border border-rose-100 bg-white/80" />
              <Skeleton className="self-end h-11 w-40 rounded-full border border-rose-200 bg-white/90" />
            </div>
            <div className="mt-5 flex w-full gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 7 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-8 w-24 shrink-0 rounded-full border border-rose-100 bg-white/90"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Skeleton className="mb-4 h-4 w-32 rounded-full bg-slate-200/70" />

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-rose-100 bg-white p-0 shadow-lg shadow-rose-100/70"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-3xl rounded-b-none bg-rose-100/60" />
                <div className="flex h-full flex-col gap-5 p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded-full bg-slate-200/80" />
                    <Skeleton className="h-3 w-24 rounded-full bg-slate-200/70" />
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-7 w-24 rounded-full bg-rose-100" />
                      <Skeleton className="h-4 w-16 rounded-full bg-slate-200/70" />
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-rose-100 pt-4">
                    <Skeleton className="h-8 w-24 rounded-full bg-rose-100/80" />
                    <Skeleton className="h-8 w-28 rounded-full border border-rose-100 bg-rose-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Skeleton className="mx-auto h-10 w-72 rounded-full bg-rose-100/80" />
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-[32px] border-none bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 p-8 text-center text-white shadow-2xl shadow-rose-400/40">
            <Skeleton className="mx-auto h-6 w-64 rounded-full bg-white/40" />
            <Skeleton className="mx-auto mt-3 h-4 w-80 rounded-full bg-white/30" />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Skeleton className="h-11 w-full rounded-full bg-white/50 sm:w-40" />
              <Skeleton className="h-11 w-full rounded-full border border-white/60 sm:w-48" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
