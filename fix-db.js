const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function fix() {
  const pool = new Pool({ connectionString: 'postgresql://postgres:ilyas2020@localhost:5432/luxestore?schema=public' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const products = await prisma.product.findMany();
    for (const p of products) {
      const newImages = p.images.map(img => img.startsWith('/uploads/') ? img.replace('/uploads/', '/api/uploads/') : img);
      await prisma.product.update({
        where: { id: p.id },
        data: { images: newImages }
      });
    }
    console.log('Fixed DB');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
fix();