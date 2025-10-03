"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Heart, User, ShoppingBag, Star, LogOut, MessageSquare, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { createClient } from "@/lib/supabase-client"

interface MobileDrawerMenuProps {
  user?: any
}

export function MobileDrawerMenu({ user }: MobileDrawerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <VisuallyHidden.Root>
          <SheetTitle>Mobil Menü</SheetTitle>
        </VisuallyHidden.Root>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center border-b p-4">
            <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Heartnote</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Navigasyon
              </h3>
              <Link
                href="/templates"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLinkClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Şablonlar</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLinkClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Planlar</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLinkClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Hakkımızda</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLinkClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                  <Star className="h-4 w-4 text-orange-600" />
                </div>
                <span className="font-medium">İletişim</span>
              </Link>
            </div>

            {/* User Section */}
            {user ? (
              <div className="border-t p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Hesabım
                </h3>
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-purple-600">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Siparişlerim</span>
                  </Link>
                  <Link
                    href="/account/favorites"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <Star className="h-4 w-4" />
                    <span>Favorilerim</span>
                  </Link>
                  <Link
                    href="/account/reviews"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Değerlendirmelerim</span>
                  </Link>
                  <Link
                    href="/account/password"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Şifre Değiştir</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Hesap
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-2 text-white font-medium hover:from-rose-600 hover:to-purple-700"
                    onClick={handleLinkClick}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
                    onClick={handleLinkClick}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}