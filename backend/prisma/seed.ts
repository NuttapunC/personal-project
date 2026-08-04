import 'dotenv/config';
import { PrismaClient } from '../src/database/generated/prisma/client';
import { Role } from '../src/database/generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin1234';

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
  });
  const prisma = new PrismaClient({ adapter });

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      password,
      name: 'Admin',
      role: Role.ADMIN
    }
  });

  console.log(`Seeded admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  const categories = [
    { name: 'Computer', description: 'คอมพิวเตอร์และโน้ตบุ๊ก' },
    { name: 'Accessory', description: 'อุปกรณ์เสริม เช่น เมาส์ คีย์บอร์ด' },
    { name: 'Monitor', description: 'จอมอนิเตอร์' },
    { name: 'Stationery', description: 'เครื่องเขียนและวัสดุสำนักงาน' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  console.log(`Seeded ${categories.length} categories`);

  const assets = [
    { name: 'โน้ตบุ๊ก Dell Latitude 5450', category: 'Computer', stockQty: 10 },
    { name: 'MacBook Pro 14 นิ้ว', category: 'Computer', stockQty: 4 },
    {
      name: 'คอมพิวเตอร์ตั้งโต๊ะ HP ProDesk',
      category: 'Computer',
      stockQty: 6
    },
    { name: 'เมาส์ไร้สาย Logitech M331', category: 'Accessory', stockQty: 25 },
    {
      name: 'คีย์บอร์ด Mechanical Keychron K2',
      category: 'Accessory',
      stockQty: 15
    },
    { name: 'หูฟัง Headset Jabra Evolve', category: 'Accessory', stockQty: 12 },
    { name: 'สาย HDMI ยาว 2 เมตร', category: 'Accessory', stockQty: 30 },
    { name: 'จอมอนิเตอร์ Dell 24 นิ้ว', category: 'Monitor', stockQty: 8 },
    {
      name: 'จอมอนิเตอร์ LG UltraWide 34 นิ้ว',
      category: 'Monitor',
      stockQty: 3
    },
    {
      name: 'ปากกาลูกลื่น (กล่อง 50 ด้าม)',
      category: 'Stationery',
      stockQty: 40
    },
    { name: 'กระดาษ A4 80 แกรม (รีม)', category: 'Stationery', stockQty: 100 },
    { name: 'สมุดโน้ต A5', category: 'Stationery', stockQty: 50 }
  ];

  let createdAssets = 0;
  for (const asset of assets) {
    // Asset ไม่มีฟิลด์ unique เลย upsert ตรงๆ ไม่ได้ ต้องเช็คชื่อซ้ำเองก่อน
    const existing = await prisma.asset.findFirst({
      where: { name: asset.name }
    });
    if (existing) continue;

    const category = await prisma.category.findUnique({
      where: { name: asset.category }
    });
    if (!category) continue;

    await prisma.asset.create({
      data: {
        name: asset.name,
        categoryId: category.id,
        stockQty: asset.stockQty
      }
    });
    createdAssets++;
  }

  console.log(
    `Seeded ${createdAssets} assets (skipped ${assets.length - createdAssets} existing)`
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
