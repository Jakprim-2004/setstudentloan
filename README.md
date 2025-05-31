# SETStudentLoan - บริการเก็บจิตอาสาออนไลน์

เว็บแอปพลิเคชันสำหรับบริการรับจ้างเก็บชั่วโมงจิตอาสาออนไลน์และกรอกข้อมูลลงระบบ กยศ (กองทุนเงินให้กู้ยืมเพื่อการศึกษา) ที่ให้บริการแบบครบวงจร ตั้งแต่การสั่งซื้อ การชำระเงิน ไปจนถึงการส่งมอบงาน

## 🌟 คุณสมบัติหลัก

### สำหรับลูกค้า
- **ระบบสมัครสมาชิกและเข้าสู่ระบบ** - ปลอดภัยด้วย Firebase Authentication
- **เลือกประเภทบริการ** - รายชั่วโมง, แพ็คเกจ 36 ชั่วโมง, หรือบริการกรอกข้อมูล
- **ระบบชำระเงิน** - รองรับการชำระผ่าน QR Code พร้อมเพย์
- **ติดตามสถานะ** - ดูสถานะคำสั่งซื้อแบบเรียลไทม์
- **ดาวน์โหลดงาน** - รับไฟล์งานที่เสร็จสิ้นแล้ว

### สำหรับผู้ดูแลระบบ
- **จัดการคำสั่งซื้อ** - ดู แก้ไข และอัปเดตสถานะ
- **อัปโหลดไฟล์งาน** - ส่งมอบงานให้ลูกค้า
- **ระบบแจ้งเตือน** - แจ้งเตือนผ่าน Discord เมื่อมีการชำระเงิน

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Next.js 15** - React framework พร้อม App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend & Database
- **Firebase Authentication** - ระบบยืนยันตัวตน
- **Firestore** - NoSQL database
- **Cloudinary** - การจัดเก็บและจัดการรูปภาพ

### การชำระเงิน
- **PromptPay QR Code** - ระบบชำระเงินผ่าน QR Code

### การแจ้งเตือน
- **Discord Webhook** - แจ้งเตือนการชำระเงินแบบเรียลไทม์

## 📋 ประเภทบริการ

### 1. บริการรายชั่วโมง
- **1-15 ชั่วโมง**: 7 บาท/ชั่วโมง
- **16-36 ชั่วโมง**: 6 บาท/ชั่วโมง
- เหมาะสำหรับผู้ที่ต้องการเก็บชั่วโมงจำนวนน้อย

### 2. แพ็คเกจ 36 ชั่วโมง
- **ราคาพิเศษ**: 150 บาท (ประหยัด 42%)
- เหมาะสำหรับผู้ที่ต้องการเก็บชั่วโมงครบ

### 3. บริการกรอกข้อมูลลงระบบ
- **ราคา**: 50 บาท/ครั้ง
- กรอกข้อมูลลงระบบ กยศ ให้ครบถ้วน

### 4. บริการเสริม
- **กรอกข้อมูลเพิ่มเติม**: +50 บาท (สำหรับบริการรายชั่วโมงและแพ็คเกจ)

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น
- Node.js 18+ 
- npm หรือ yarn
- Firebase project
- Cloudinary account
- Discord webhook URL (สำหรับการแจ้งเตือน)

### การติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd setstudentloan
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **ตั้งค่า environment variables**
สร้างไฟล์ `.env.local` และเพิ่มค่าต่อไปนี้:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

4. **รันโปรเจค**
```bash
npm run dev
```

เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`

## 📁 โครงสร้างโปรเจค

```
├── app/                          # Next.js App Router
│   ├── admin/                    # หน้าผู้ดูแลระบบ
│   ├── confirmation/             # หน้ายืนยันการสั่งซื้อ
│   ├── dashboard/                # หน้าแดชบอร์ดผู้ใช้
│   ├── login/                    # หน้าเข้าสู่ระบบ
│   ├── orders/                   # หน้าจัดการคำสั่งซื้อ
│   ├── payment/                  # หน้าชำระเงิน
│   ├── register/                 # หน้าลงทะเบียน
│   └── api/                      # API routes
├── components/                   # React components
│   ├── auth/                     # Components เกี่ยวกับการยืนยันตัวตน
│   ├── dashboard/                # Components สำหรับแดชบอร์ด
│   ├── layout/                   # Layout components
│   └── ui/                       # UI components (shadcn/ui)
├── lib/                          # Utility functions และ services
│   ├── auth-service.ts           # บริการยืนยันตัวตน
│   ├── cloudinary.ts             # การจัดการรูปภาพ
│   ├── db-service.ts             # บริการฐานข้อมูล
│   ├── discord-service.ts        # บริการแจ้งเตือน Discord
│   ├── firebase.ts               # การตั้งค่า Firebase
│   └── utils.ts                  # Utility functions
└── hooks/                        # Custom React hooks
```

## 🔐 ระบบความปลอดภัย

- **Firebase Authentication** - ระบบยืนยันตัวตนที่ปลอดภัย
- **Role-based Access Control** - แยกสิทธิ์ผู้ใช้และผู้ดูแล
- **Data Validation** - ตรวจสอบข้อมูลทั้งฝั่ง client และ server
- **Auto Logout** - ออกจากระบบอัตโนมัติเมื่อไม่มีการใช้งาน

## 📱 Responsive Design

เว็บแอปพลิเคชันรองรับการใช้งานบนอุปกรณ์ทุกขนาด:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔄 Flow การใช้งาน

### สำหรับลูกค้า
1. **สมัครสมาชิก/เข้าสู่ระบบ**
2. **เลือกประเภทบริการ** และกรอกข้อมูล
3. **ชำระเงิน** ผ่าน QR Code พร้อมเพย์
4. **อัปโหลดสลิป** การโอนเงิน
5. **รอการดำเนินการ** (1-3 วันทำการ)
6. **ดาวน์โหลดงาน** ที่เสร็จสิ้น

### สำหรับผู้ดูแล
1. **เข้าสู่ระบบ** ด้วยบัญชีผู้ดูแล
2. **ตรวจสอบคำสั่งซื้อ** ใหม่
3. **อัปเดตสถานะ** เป็น "กำลังดำเนินการ"
4. **ดำเนินการ** ตามที่ลูกค้าต้องการ
5. **อัปโหลดไฟล์งาน** และอัปเดตสถานะเป็น "เสร็จสิ้น"

## 🎯 การใช้งาน API

### Authentication
```typescript
import { signIn, registerUser, signOut } from '@/lib/auth-service'

// เข้าสู่ระบบ
await signIn(email, password)

// สมัครสมาชิก
await registerUser(email, password, displayName)

// ออกจากระบบ
await signOut()
```

### การจัดการคำสั่งซื้อ
```typescript
import { createOrderWithSlip, getOrdersByUserId } from '@/lib/db-service'

// สร้างคำสั่งซื้อพร้อมสลิป
await createOrderWithSlip(orderData, slipFile)

// ดึงคำสั่งซื้อของผู้ใช้
const orders = await getOrdersByUserId(userId)
```



## 🔄 การอัปเดต

- **v1.0.0** - เปิดตัวระบบครั้งแรก
- รองรับบริการรายชั่วโมง แพ็คเกจ และกรอกข้อมูล
- ระบบชำระเงินผ่าน QR Code
- ระบบแจ้งเตือน Discord

---

**หมายเหตุ**: โปรเจคนี้พัฒนาด้วย Next.js และ Firebase เพื่อให้บริการที่รวดเร็ว ปลอดภัย และใช้งานง่าย
```
