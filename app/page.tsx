import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Database, ArrowRight, CheckCircle } from "lucide-react"
import { PageTransition } from "@/components/ui/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              SETStudentLoan
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              บริการรับจ้างเก็บชั่วโมงจิตอาสาออนไลน์และกรอกข้อมูลลงระบบ ง่าย สะดวก รวดเร็ว
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                asChild
              >
                <Link href="#services">
                  เริ่มต้นใช้บริการ <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">บริการรวดเร็ว</h3>
                <p className="text-gray-600">ดำเนินการทันทีหลังจากได้รับการชำระเงิน ไม่ต้องรอนาน</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">ทีมงานมืออาชีพ</h3>
                <p className="text-gray-600">ทีมงานที่มีประสบการณ์ พร้อมให้บริการอย่างมีคุณภาพ</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">ข้อมูลปลอดภัย</h3>
                <p className="text-gray-600">ข้อมูลของคุณจะถูกเก็บเป็นความลับและปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div id="services" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">บริการของเรา</h2>
              <p className="text-lg text-gray-600">เลือกบริการที่ตรงกับความต้องการของคุณ</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                <div className="h-2 bg-blue-500"></div>
                <CardHeader>
                  <CardTitle>บริการรายชั่วโมง</CardTitle>
                  <CardDescription>สำหรับผู้ที่ต้องการเก็บชั่วโมงจำนวนน้อย</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600">฿7 - ฿6</div>
                    <p className="text-gray-500">ต่อชั่วโมง</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>1-15 ชั่วโมง: ชั่วโมงละ 7 บาท</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>15-36 ชั่วโมง: ชั่วโมงละ 6 บาท</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>ดำเนินการภายใน 24 ชั่วโมง</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>งานเสร็จภายใน 1-3 วันหลังจากชำระเงิน</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>รับรองผลงาน 100%</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="px-6 pb-6">
                  <Link
                    href="/register?type=hourly"
                    className="block w-full py-2 text-center text-white bg-blue-500 rounded font-medium"
                  >
                    สั่งจองบริการ
                  </Link>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden relative flex flex-col">
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  แนะนำ
                </div>
                <div className="h-2 bg-teal-500"></div>
                <CardHeader>
                  <CardTitle>แพ็คเกจ 36 ชั่วโมง</CardTitle>
                  <CardDescription>ประหยัดกว่าเมื่อเทียบกับรายชั่วโมง</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-teal-600">฿150</div>
                    <p className="text-gray-500">สำหรับ 36 ชั่วโมง</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>ประหยัดกว่า 42% จากราคาปกติ</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>ดำเนินการภายใน 24 ชั่วโมง</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>งานเสร็จภายใน 1-3 วันหลังจากชำระเงิน</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>รับรองผลงาน 100%</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="px-6 pb-6">
                  <Link
                    href="/register?type=package"
                    className="block w-full py-2 text-center text-white bg-teal-500 rounded font-medium"
                  >
                    สั่งจองบริการ
                  </Link>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                <div className="h-2 bg-purple-500"></div>
                <CardHeader>
                  <CardTitle>บริการกรอกข้อมูล</CardTitle>
                  <CardDescription>บริการกรอกข้อมูลลงระบบให้เรียบร้อย</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-purple-600">฿50</div>
                    <p className="text-gray-500">ต่อครั้ง</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>กรอกข้อมูลลงระบบให้ครบถ้วน</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>ดำเนินการภายใน 24 ชั่วโมง</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>งานเสร็จภายใน 1-3 วันหลังจากชำระเงิน</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>รับรองผลงาน 100%</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="px-6 pb-6">
                  <Link
                    href="/register?type=system"
                    className="block w-full py-2 text-center text-white bg-purple-500 rounded font-medium"
                  >
                    สั่งจองบริการ
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">มีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม</h2>
            <p className="text-lg text-gray-600 mb-6">ติดต่อเราได้ทางช่องทางด้านล่าง</p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Link href="https://line.me/ti/p/6JSq5f9K0-" target="_blank" rel="noopener noreferrer">
                Line: MinOru21 - Click Me !
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} บริการจิตอาสาออนไลน์. สงวนลิขสิทธิ์.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
