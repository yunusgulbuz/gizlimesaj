"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page on new search

    startTransition(() => {
      router.push(`/templates?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="search"
        placeholder="Şablon ara..."
        defaultValue={searchParams.get("search") || ""}
        className="rounded-full border-rose-100 bg-white/95 pl-10 focus-visible:ring-rose-300"
        name="search"
        disabled={isPending}
      />
    </form>
  );
}
