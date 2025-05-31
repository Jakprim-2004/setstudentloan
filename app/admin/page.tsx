"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PageTransition } from "@/components/ui/page-transition"
// แก้ไขการ import โดยเพิ่ม deleteOrder
import {
  getOrders,
  getOrdersByStatus,
  updateOrderStatus,
  updateOrderDownloadUrl,
  deleteOrder,
  type OrderData,
} from "@/lib/db-service"
// เพิ่ม import สำหรับไอคอน Clock
// เพิ่ม import สำหรับ AlertDialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// เพิ่ม import สำหรับไอคอน Trash2
import { AlertCircle, RefreshCw, CheckCircle, XCircle, Eye, LinkIcon, Clock, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { useAuth } from "@/components/auth/auth-provider"
import { signIn } from "@/lib/auth-service"

export default function AdminPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [orders, setOrders] = useState<OrderData[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [savingUrl, setSavingUrl] = useState(false)
  const [urlSuccess, setUrlSuccess] = useState(false)
  const router = useRouter()
  // เพิ่ม state สำหรับ dialog ยืนยันการลบ ในฟังก์ชัน AdminPage
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && user && userProfile) {
      if (userProfile.role === "admin") {
        setIsAuthenticated(true)
        setShowLoginDialog(false)
      } else {
        // Redirect non-admin users
        router.push("/dashboard")
      }
    }
  }, [user, userProfile, authLoading, router])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      let fetchedOrders: OrderData[]

      if (activeTab === "all") {
        fetchedOrders = await getOrders()
      } else {
        fetchedOrders = await getOrdersByStatus(activeTab as "pending" | "completed")
      }

      setOrders(fetchedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated, activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn(username, password)

      // In preview environment, check if the user is admin@example.com
      if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
        if (username === "admin@example.com") {
          setIsAuthenticated(true)
          setShowLoginDialog(false)
          return
        } else {
          setError("คุณไม่มีสิทธิ์เข้าถึงหน้านี้")
          return
        }
      }

      // For production, check if user is admin
      if (userProfile?.role === "admin") {
        setIsAuthenticated(true)
        setShowLoginDialog(false)
      } else {
        setError("คุณไม่มีสิทธิ์เข้าถึงหน้านี้")
      }
    } catch (error: any) {
      console.error("Error signing in:", error)

      // Handle different Firebase auth errors
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      } else {
        setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: "pending" | "in_progress" | "completed") => {
    setLoading(true)

    try {
      await updateOrderStatus(orderId, newStatus)

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("ไม่สามารถอัพเดทสถานะคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDownloadUrl = async () => {
    if (!selectedOrder || !selectedOrder.id || !downloadUrl) return

    setSavingUrl(true)
    setUrlSuccess(false)
    setError(null)

    try {
      await updateOrderDownloadUrl(selectedOrder.id, downloadUrl)

      // Update local state
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, downloadUrl: downloadUrl } : order)))
      setSelectedOrder({ ...selectedOrder, downloadUrl: downloadUrl })
      setUrlSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUrlSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating download URL:", error)
      setError("ไม่สามารถบันทึก URL ดาวน์โหลดได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setSavingUrl(false)
    }
  }

  const viewOrderDetails = (order: OrderData) => {
    setSelectedOrder(order)
    setDownloadUrl(order.downloadUrl || "")
    setUrlSuccess(false)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-"

    try {
      // Convert Firestore Timestamp to JavaScript Date
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, "d MMMM yyyy, HH:mm", { locale: th })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "-"
    }
  }

  // เพิ่มฟังก์ชัน handleDeleteOrder ในฟังก์ชัน AdminPage
  const handleDeleteOrder = async (orderId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteOrder(orderId)

      // Update local state
      setOrders(orders.filter((order) => order.id !== orderId))

      // Close dialog if open
      setOrderToDelete(null)

      // Close order details if the deleted order was selected
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Error deleting order:", error)
      setError("ไม่สามารถลบคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
          <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">เข้าสู่ระบบผู้ดูแล</DialogTitle>
                <DialogDescription>กรุณาใส่ชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>ข้อผิดพลาด</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">อีเมล</Label>
                  <Input
                    id="username"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500"
                    required
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
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">ระบบจัดการคำสั่งซื้อ</CardTitle>
                <CardDescription className="text-blue-100">จัดการคำสั่งซื้อและตรวจสอบการชำระเงิน</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white/20"
                  onClick={fetchOrders}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  รีเฟรช
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>ข้อผิดพลาด</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
                <TabsTrigger value="in_progress">กำลังดำเนินการ</TabsTrigger>
                <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <OrdersTable
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  onViewDetails={viewOrderDetails}
                  loading={loading}
                  formatDate={formatDate}
                  onDeleteOrder={(id) => setOrderToDelete(id)}
                />
              </TabsContent>

              <TabsContent value="pending">
                <OrdersTable
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  onViewDetails={viewOrderDetails}
                  loading={loading}
                  formatDate={formatDate}
                  onDeleteOrder={(id) => setOrderToDelete(id)}
                />
              </TabsContent>

              <TabsContent value="completed">
                <OrdersTable
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  onViewDetails={viewOrderDetails}
                  loading={loading}
                  formatDate={formatDate}
                  onDeleteOrder={(id) => setOrderToDelete(id)}
                />
              </TabsContent>
              <TabsContent value="in_progress">
                <OrdersTable
                  orders={orders}
                  onStatusChange={handleStatusChange}
                  onViewDetails={viewOrderDetails}
                  loading={loading}
                  formatDate={formatDate}
                  onDeleteOrder={(id) => setOrderToDelete(id)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">รายละเอียดคำสั่งซื้อ #{selectedOrder.id}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-lg">ข้อมูลลูกค้า</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ชื่อ:</span>
                      <span className="font-medium">{selectedOrder.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">เลขบัตรประชาชน:</span>
                      <span className="font-medium">{selectedOrder.idNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">รหัสเข้ากยศคอนเน็ค:</span>
                      <span className="font-medium">{selectedOrder.connectId}</span>
                    </div>
                    {selectedOrder.studentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">รหัสนิสิต:</span>
                        <span className="font-medium">{selectedOrder.studentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                      <span className="font-medium">{selectedOrder.phone}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">หมายเหตุ:</span>
                        <span className="font-medium">{selectedOrder.notes}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium mb-3 mt-6 text-lg">ข้อมูลการสั่งซื้อ</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ประเภท:</span>
                      <span className="font-medium">
                        {selectedOrder.type === "hourly" && "รายชั่วโมง"}
                        {selectedOrder.type === "package" && "แพ็คเกจ 36 ชั่วโมง"}
                        {selectedOrder.type === "system" && "กรอกข้อมูลลงระบบ"}
                      </span>
                    </div>
                    {selectedOrder.hours > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">จำนวนชั่วโมง:</span>
                        <span className="font-medium">{selectedOrder.hours} ชั่วโมง</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">กรอกข้อมูลลงระบบ:</span>
                      <span className="font-medium">{selectedOrder.includeSystem ? "ใช่" : "ไม่ใช่"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ยอดชำระ:</span>
                      <span className="font-medium">{selectedOrder.amount} บาท</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">วันที่สั่งซื้อ:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">สถานะ:</span>
                      <Badge variant={selectedOrder.status === "completed" ? "default" : "outline"}>
                        {selectedOrder.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                      </Badge>
                    </div>
                  </div>

                  {/* เพิ่มส่วนสำหรับ URL ดาวน์โหลด */}
                  <h3 className="font-medium mb-3 mt-6 text-lg">URL ดาวน์โหลดไฟล์งาน</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="downloadUrl">URL สำหรับดาวน์โหลดไฟล์งาน</Label>
                      <div className="flex gap-2">
                        <Input
                          id="downloadUrl"
                          value={downloadUrl}
                          onChange={(e) => setDownloadUrl(e.target.value)}
                          placeholder="https://example.com/file.zip"
                          className="flex-1"
                        />
                        <Button onClick={handleSaveDownloadUrl} disabled={savingUrl || !downloadUrl} size="sm">
                          {savingUrl ? (
                            <LoadingSpinner className="mr-2" size={16} />
                          ) : (
                            <LinkIcon className="mr-2 h-4 w-4" />
                          )}
                          บันทึก
                        </Button>
                      </div>
                      {urlSuccess && <p className="text-sm text-green-600">บันทึก URL เรียบร้อยแล้ว</p>}
                      {selectedOrder.downloadUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">URL ปัจจุบัน:</p>
                          <a
                            href={selectedOrder.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {selectedOrder.downloadUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button
                      className="w-full"
                      variant={selectedOrder.status === "completed" ? "outline" : "default"}
                      onClick={() => {
                        handleStatusChange(
                          selectedOrder.id!,
                          selectedOrder.status === "completed" ? "pending" : "completed",
                        )
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadingSpinner className="mr-2" />
                      ) : selectedOrder.status === "completed" ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      {selectedOrder.status === "completed" ? "เปลี่ยนเป็นรอดำเนินการ" : "เปลี่ยนเป็นเสร็จสิ้น"}
                    </Button>

                    {/* เพิ่มปุ่มลบคำสั่งซื้อ */}
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(null) // ปิดหน้ารายละเอียด
                        setOrderToDelete(selectedOrder.id!) // เปิด dialog ยืนยันการลบ
                      }}
                      disabled={loading}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบคำสั่งซื้อนี้
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-lg">สลิปการชำระเงิน</h3>
                  {selectedOrder.paymentSlipUrl ? (
                    <div className="border rounded-md overflow-hidden bg-white">
                      <img
                        src={selectedOrder.paymentSlipUrl || "/placeholder.svg"}
                        alt="Payment Slip"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md p-8 text-center bg-gray-50">
                      <div className="text-gray-400 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500">ยังไม่มีสลิปการชำระเงิน</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* Dialog ยืนยันการลบคำสั่งซื้อ */}
        <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบคำสั่งซื้อ</AlertDialogTitle>
              <AlertDialogDescription>
                คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อนี้? การกระทำนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดจะถูกลบออกจากระบบ
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => orderToDelete && handleDeleteOrder(orderToDelete)}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {loading ? <LoadingSpinner className="mr-2" size={16} /> : <Trash2 className="mr-2 h-4 w-4" />}
                ลบคำสั่งซื้อ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  )
}

// แก้ไขฟังก์ชัน OrdersTable เพื่อแสดงสถานะ "in_progress" ด้วยสีที่แตกต่าง
function OrdersTable({
  orders,
  onStatusChange,
  onViewDetails,
  loading,
  formatDate,
  onDeleteOrder, // เพิ่ม prop สำหรับการลบคำสั่งซื้อ
}: {
  orders: OrderData[]
  onStatusChange: (id: string, status: "pending" | "in_progress" | "completed") => void
  onViewDetails: (order: OrderData) => void
  loading: boolean
  formatDate: (timestamp: any) => string
  onDeleteOrder: (id: string) => void // เพิ่ม prop type
}) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>รหัสคำสั่งซื้อ</TableHead>
            <TableHead>ชื่อลูกค้า</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-right">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <LoadingSpinner className="mx-auto" />
                <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">ไม่พบข้อมูลคำสั่งซื้อ</p>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{order.id?.substring(0, 8)}</TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>
                  {order.type === "hourly" && "รายชั่วโมง"}
                  {order.type === "package" && "แพ็คเกจ 36 ชั่วโมง"}
                  {order.type === "system" && "บริการกรอกข้อมูลลงระบบ"}
                </TableCell>
                <TableCell>{order.amount} บาท</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "in_progress"
                          ? "secondary"
                          : "outline"
                    }
                    className={order.status === "in_progress" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                  >
                    {order.status === "completed"
                      ? "เสร็จสิ้น"
                      : order.status === "in_progress"
                        ? "กำลังดำเนินการ"
                        : "รอดำเนินการ"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                      <Eye className="h-4 w-4 mr-1" />
                      ดูรายละเอียด
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(order.id!, "in_progress")}
                        className="border-amber-500 text-amber-500 hover:bg-amber-50"
                        disabled={loading}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        กำลังดำเนินการ
                      </Button>
                    )}
                    {order.status === "in_progress" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onStatusChange(order.id!, "completed")}
                        disabled={loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        เสร็จสิ้น
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(order.id!, "pending")}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        ยกเลิก
                      </Button>
                    )}
                    {/* เพิ่มปุ่มลบคำสั่งซื้อ */}
                    <Button variant="destructive" size="sm" onClick={() => onDeleteOrder(order.id!)} disabled={loading}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      ลบ
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
