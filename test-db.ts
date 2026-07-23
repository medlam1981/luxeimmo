import prisma from './src/lib/prisma';
async function test() {
  const posts = await prisma.post.findMany({ select: { id: true, coverImage: true } });
  for (const post of posts) {
    if (post.coverImage && post.coverImage.startsWith('data:image')) {
      console.log(`Post ${post.id} has base64 cover image! Length: ${post.coverImage.length}`);
    }
  }
}
test();
