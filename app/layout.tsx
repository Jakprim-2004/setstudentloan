import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { AutoLogoutWarning } from "@/components/auth/auto-logout-warning"
import { SpeedInsights } from "@vercel/speed-insights/next"

// ตรวจสอบและแก้ไขการโหลด global CSS หรือ font ที่อาจมีปัญหา
// ถ้ามีการโหลด font จาก external source ให้เพิ่มการตรวจสอบข้อผิดพลาด
// หรือใช้ font ที่มีอยู่ในระบบแทน

// ถ้ามีการใช้ background image ใน global CSS ให้ตรวจสอบว่า URL ถูกต้องหรือไม่
// หรือแทนที่ด้วย solid color แทน

// กำหนดค่าฟอนต์ใหม่โดยระบุเฉพาะ subset ที่รองรับ
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "บริการเก็บจิตอาสาออนไลน์ SETStudentLoan",
  description: "บริการรับจ้างเก็บชั่วโมงจิตอาสาออนไลน์และกรอกข้อมูลลงระบบ",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <AutoLogoutWarning />
            </div>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
