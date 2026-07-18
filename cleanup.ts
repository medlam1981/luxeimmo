import prisma from './src/lib/prisma';

async function cleanup() {
  try {
    const deleted = await prisma.property.deleteMany({
      where: {
        userId: null
      }
    });
    console.log(`Deleted ${deleted.count} properties.`);
  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
