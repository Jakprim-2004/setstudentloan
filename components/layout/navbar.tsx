"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { signOut } from "@/lib/auth-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Menu, X, CreditCard } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, userProfile } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              SETStudentLoan
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`}
          >
            หน้าหลัก
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive("/dashboard") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}
            >
              แดชบอร์ด
            </Link>
          )}
          <Link
            href="/credits"
            className={`text-sm font-medium transition-colors ${
              isActive("/credits") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`}
          >
            เครดิต
          </Link>
          {userProfile?.role === "admin" && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}
            >
              ผู้ดูแลระบบ
            </Link>
          )}
        </nav>

        {/* ย้ายปุ่มเข้าสู่ระบบและสมัครสมาชิกมาไว้ตรงนี้ */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {userProfile?.displayName || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">แดชบอร์ด</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/credits">เครดิต</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">โปรไฟล์</Link>
                </DropdownMenuItem>
                {userProfile?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">ผู้ดูแลระบบ</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-500 bg-white border border-gray-300 rounded font-medium text-sm"
              >
                เข้าสู่ระบบ
              </Link>
              <Link href="/register/account" className="px-4 py-2 text-white bg-blue-500 rounded font-medium text-sm">
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              href="/"
              className={`block py-2 text-sm font-medium ${isActive("/") ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              หน้าหลัก
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`block py-2 text-sm font-medium ${
                  isActive("/dashboard") ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                แดชบอร์ด
              </Link>
            )}
            <Link
              href="/credits"
              className={`block py-2 text-sm font-medium ${isActive("/credits") ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CreditCard className="h-4 w-4 mr-1 inline" />
              เครดิต
            </Link>
            {userProfile?.role === "admin" && (
              <Link
                href="/admin"
                className={`block py-2 text-sm font-medium ${isActive("/admin") ? "text-blue-600" : "text-gray-700"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ผู้ดูแลระบบ
              </Link>
            )}

            {user ? (
              <>
                <div className="py-2 font-medium text-sm text-gray-500">{userProfile?.displayName || user.email}</div>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  โปรไฟล์
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-sm font-medium text-red-600"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-blue-500 bg-white border border-gray-300 rounded font-medium text-sm text-center"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-white bg-blue-500 rounded font-medium text-sm text-center"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
