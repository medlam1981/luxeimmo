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

  return <PostForm initialData={post} />;
}
