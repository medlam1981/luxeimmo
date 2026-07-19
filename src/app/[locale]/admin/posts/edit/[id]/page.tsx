import { setRequestLocale } from 'next-intl/server';
import { PostForm } from '../../PostForm';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  let initialData = { ...post };
  try {
    const titleObj = JSON.parse(post.title);
    initialData.title = titleObj.en || post.title;
  } catch {}
  try {
    const slugObj = JSON.parse(post.slug);
    initialData.slug = slugObj.en || post.slug;
  } catch {}
  try {
    const contentObj = JSON.parse(post.content);
    initialData.content = contentObj.en || post.content;
  } catch {}

  return <PostForm initialData={initialData} />;
}
