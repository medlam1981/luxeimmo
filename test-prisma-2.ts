import prisma from './src/lib/prisma';
async function main() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      coverImage: true,
      createdAt: true,
    }
  });
  console.log("Success! Posts count:", posts.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
