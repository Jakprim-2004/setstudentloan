"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/ui/page-transition"
import { Confetti } from "@/components/ui/confetti"
import { useEffect } from "react"

export default function ConfirmationPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageTransition>
      <Confetti />
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-400 to-teal-500"></div>
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">การสั่งซื้อเสร็จสมบูรณ์</CardTitle>
              <CardDescription className="text-base">ขอบคุณสำหรับการใช้บริการของเรา</CardDescription>
            </CardHeader>
            <CardContent className="text-center px-8">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-6">
                <p className="text-green-800">เราได้รับข้อมูลการสั่งซื้อและการชำระเงินของคุณแล้ว</p>
              </div>
              <p className="mb-4">ทีมงานจะดำเนินการตามที่คุณร้องขอโดยเร็วที่สุด</p>
              <p className="text-sm text-gray-500">
                หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเราผ่านทาง Line: MinOru21
              </p>
            </CardContent>
            <CardFooter className="flex justify-center bg-gray-50 px-6 py-4">
              <Button
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                asChild
              >
                <Link href="/">กลับสู่หน้าหลัก</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
