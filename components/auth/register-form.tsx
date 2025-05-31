"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerUser, checkEmailExists } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInUse, setEmailInUse] = useState(false)
  const router = useRouter()

  // Debounce email to avoid too many API calls
  const debouncedEmail = useDebounce(email, 500)

  // Check if email exists when debounced email changes
  useEffect(() => {
    const checkEmail = async () => {
      // ตรวจสอบว่าอีเมลมีรูปแบบที่ถูกต้องก่อนทำการตรวจสอบ
      if (debouncedEmail && debouncedEmail.includes("@") && debouncedEmail.includes(".")) {
        setCheckingEmail(true)
        try {
          // ตรวจสอบว่าอีเมลนี้มีในระบบแล้วหรือไม่
          const exists = await checkEmailExists(debouncedEmail)
          if (exists) {
            setEmailInUse(true)
            setError("อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบด้วยอีเมลนี้")
          } else {
            setEmailInUse(false)
            setError(null)
          }
        } catch (err) {
          console.error("Error checking email:", err)
        } finally {
          setCheckingEmail(false)
        }
      } else if (debouncedEmail) {
        // ถ้ามีการพิมพ์อีเมลแต่ยังไม่สมบูรณ์ ให้รีเซ็ตสถานะ
        setEmailInUse(false)
        setError(null)
      }
    }

    checkEmail()
  }, [debouncedEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Don't submit if email is already in use
    if (emailInUse) {
      return
    }

    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
      setLoading(false)
      return
    }

    try {
      console.log("Starting user registration with data:", { email, displayName })

      // Register user and create profile in database
      await registerUser(email, password, displayName)

      console.log("Registration successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle different Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setEmailInUse(true)
        setError("อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบด้วยอีเมลนี้")
      } else if (error.code === "auth/weak-password") {
        setError("รหัสผ่านไม่ปลอดภัยเพียงพอ ควรมีความยาวอย่างน้อย 6 ตัวอักษร")
      } else if (error.code === "auth/invalid-email") {
        setError("รูปแบบอีเมลไม่ถูกต้อง")
      } else if (error.code === "auth/network-request-failed") {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต")
      } else {
        setError(`เกิดข้อผิดพลาดในการสมัครสมาชิก: ${error.message || "กรุณาลองใหม่อีกครั้ง"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <CardTitle className="text-2xl">สมัครสมาชิก</CardTitle>
        <CardDescription className="text-blue-100">สร้างบัญชีเพื่อใช้บริการและตรวจสอบสถานะงาน</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {/* แสดงข้อความแจ้งเตือนเกี่ยวกับการใช้อีเมล KU */}

          {error && (
            <Alert
              variant={emailInUse ? "default" : "destructive"}
              className={emailInUse ? "bg-blue-50 border-blue-200" : ""}
            >
              <AlertCircle className={`h-4 w-4 ${emailInUse ? "text-blue-500" : ""}`} />
              <AlertTitle>{emailInUse ? "อีเมลนี้มีอยู่ในระบบแล้ว" : "ข้อผิดพลาด"}</AlertTitle>
              <AlertDescription>
                {error}
                {emailInUse && (
                  <div className="mt-2">
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      คลิกที่นี่เพื่อเข้าสู่ระบบ
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  // We'll let the useEffect handle the email check now
                }}
                className={`focus:ring-2 focus:ring-blue-500 ${emailInUse ? "border-blue-500 pr-10" : ""}`}
                required
                disabled={loading}
                placeholder="example@email.com"
              />
              {checkingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size={16} className="text-gray-400" />
                </div>
              )}
              {emailInUse && !checkingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            {checkingEmail && <p className="text-xs text-gray-500">กำลังตรวจสอบอีเมล...</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">ชื่อ-นามสกุล</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500">รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 h-12 text-lg"
            disabled={loading || checkingEmail || emailInUse}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" />
                กำลังสมัครสมาชิก...
              </>
            ) : (
              "สมัครสมาชิก"
            )}
          </Button>
          <div className="text-center text-sm">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
