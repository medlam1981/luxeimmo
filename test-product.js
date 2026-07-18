const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test() {
  const pool = new Pool({ connectionString: 'postgresql://postgres:ilyas2020@localhost:5432/luxestore?schema=public' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
    console.log(products);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
test();