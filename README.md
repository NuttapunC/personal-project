# Asset Request System — ระบบเบิกอุปกรณ์สำนักงาน

เว็บแอปพลิเคชันสำหรับให้พนักงานยื่นคำขอเบิกอุปกรณ์สำนักงาน และให้ผู้ดูแลระบบพิจารณาอนุมัติ
เมื่ออนุมัติแล้วระบบจะตัดจำนวนคงคลังให้อัตโนมัติ พร้อมหน้าสรุปภาพรวมสำหรับผู้ดูแล

จัดทำเพื่อประกอบ Personal Project ตำแหน่ง Full-stack Developer (Next.js & NestJS)

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, shadcn/base-ui, react-hook-form + zod |
| Backend | NestJS 11 (REST API), class-validator |
| Database | PostgreSQL + Prisma 7 |
| Authentication | JWT + bcrypt (เก็บ token ใน httpOnly cookie ผ่าน next-auth v5) |

## สถาปัตยกรรม

```
Browser ──► Next.js (frontend, :3000) ──► NestJS (backend, :8000) ──► PostgreSQL
              Server Component +            Guard / Service /          Prisma
              Server Action                 Prisma
```

- **กติกาทางธุรกิจทุกข้อบังคับที่ Backend เสมอ** ไม่พึ่งการซ่อนปุ่มที่ฝั่งหน้าเว็บ
- Frontend เรียก API ผ่าน Server Action เท่านั้น token จึงไม่เคยหลุดไปฝั่ง client
- แยกโมดูลตามหน้าที่: `auth`, `user`, `category`, `asset`, `request`, `dashboard`

## วิธีติดตั้งและรัน

**สิ่งที่ต้องมี:** Node.js 20+, pnpm, PostgreSQL

### 1. Backend

```bash
cd backend
pnpm install
```

สร้างไฟล์ `.env` (ดูตัวอย่างจาก `.env.example`):

```
PORT="8000"
DATABASE_URL="postgres://<user>:<password>@localhost:5432/asset_request"
ACCESS_TOKEN_SECRET="<สุ่มความยาวอย่างน้อย 32 ตัวอักษร>"
ACCESS_TOKEN_EXPIRES_IN="86400"
```

จากนั้นสร้างตารางและข้อมูลตั้งต้น:

```bash
pnpm prisma migrate dev
```

```bash
pnpm seed
```

```bash
pnpm start:dev
```

### 2. Frontend

```bash
cd frontend
pnpm install
```

สร้างไฟล์ `.env`:

```
API_URL="http://localhost:8000"
AUTH_SECRET="<สุ่มความยาวอย่างน้อย 32 ตัวอักษร>"
```

```bash
pnpm dev
```

เปิด http://localhost:3000

### บัญชีสำหรับทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
|---|---|---|
| ADMIN | admin@example.com | admin1234 |

บัญชีพนักงานสมัครเองได้ที่หน้า `/signup` (สมัครใหม่จะได้บทบาท USER เสมอ)

## ฟีเจอร์

| กลุ่ม | รายละเอียด |
|---|---|
| Authentication | สมัครสมาชิก, เข้าสู่ระบบด้วย JWT, bcrypt hash, Protected Routes, 2 บทบาท (USER/ADMIN) |
| CRUD Category | จัดการหมวดหมู่อุปกรณ์ (ลบไม่ได้ถ้ายังมีอุปกรณ์ใช้อยู่) |
| CRUD Asset | จัดการอุปกรณ์ + ปรับสต็อก + Soft Delete + แบ่งหน้า |
| CRUD Request | สร้างคำขอเบิก, ติดตามสถานะ, ยกเลิกคำขอที่ยังรอพิจารณา |
| ⭐ Approval Workflow | อนุมัติ/ปฏิเสธ + ตัดสต็อกอัตโนมัติใน Transaction เดียว + บันทึกผู้ตัดสินใจ |
| ⭐ Search & Filter | ค้นหาอุปกรณ์, กรองหมวดหมู่, กรองคำขอตามสถานะและผู้ขอ |
| Dashboard | สรุปคำขอค้าง, อนุมัติเดือนนี้, อุปกรณ์ใกล้หมด, อุปกรณ์ที่ถูกเบิกบ่อย |

## หน้าจอ

| Path | ผู้ใช้ | หน้าที่ |
|---|---|---|
| `/signup`, `/login` | Public | สมัครสมาชิก / เข้าสู่ระบบ |
| `/assets` | User | รายการอุปกรณ์ + ค้นหา/กรอง + สร้างคำขอเบิก |
| `/requests` | User | คำขอของฉัน + กรองสถานะ + ยกเลิก |
| `/admin/dashboard` | Admin | ภาพรวมระบบ |
| `/admin/requests` | Admin | พิจารณาคำขอของทุกคน |
| `/admin/assets` | Admin | จัดการอุปกรณ์ |
| `/admin/categories` | Admin | จัดการหมวดหมู่ |

## จุดที่ออกแบบเป็นพิเศษ

**การป้องกัน Race Condition ตอนอนุมัติ** — เมื่อผู้ดูแลหลายคนกดอนุมัติพร้อมกัน จำนวนคงคลังต้องไม่ติดลบ
ระบบจึงไม่ใช้วิธี "อ่านค่ามาเช็คแล้วค่อยเขียนทับ" แต่ให้ฐานข้อมูลตรวจเงื่อนไขในคำสั่งเดียวกับที่หักลบ:

```ts
await tx.asset.updateMany({
  where: { id: assetId, stockQty: { gte: quantity } },
  data: { stockQty: { decrement: quantity } }
});
```

ทั้งการเช็คสถานะ ตัดสต็อก และเปลี่ยนสถานะคำขอ อยู่ใน `prisma.$transaction()` เดียวกัน
ถ้าขั้นตอนใดล้มเหลว ทุกอย่างจะถูกย้อนกลับทั้งหมด

**Soft Delete** — การลบอุปกรณ์ใช้การตั้งค่า `isActive = false` เพื่อให้คำขอเบิกในอดีตยังอ้างอิงข้อมูลอุปกรณ์ได้

## เอกสารประกอบ

รายละเอียดของแต่ละฟีเจอร์ (ข้อกำหนด, API, กติกา, บันทึกการพัฒนา) อยู่ในโฟลเดอร์ [`docs/`](docs/)
เริ่มอ่านที่ [docs/00-overview.md](docs/00-overview.md)
