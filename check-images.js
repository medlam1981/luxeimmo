const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const posts = await prisma.post.findMany({ select: { id: true, coverImage: true, content: true } });
  let coverSize = 0;
  let contentSize = 0;
  
  for (const p of posts) {
    if (p.coverImage) coverSize += p.coverImage.length;
    if (p.content) contentSize += p.content.length;
  }
  
  console.log(`Total CoverImage Size: ${coverSize} bytes`);
  console.log(`Total Content Size: ${contentSize} bytes`);
  
  process.exit(0);
}
check();
