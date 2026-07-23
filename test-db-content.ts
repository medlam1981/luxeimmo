import prisma from './src/lib/prisma';
async function test() {
  const posts = await prisma.post.findMany({ select: { id: true, content: true } });
  let totalLength = 0;
  for (const post of posts) {
    if (post.content) {
      console.log(`Post ${post.id} content length: ${post.content.length}`);
      totalLength += post.content.length;
    }
  }
  console.log(`Total content length for all posts: ${totalLength}`);
}
test();
