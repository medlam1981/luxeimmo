import { setRequestLocale } from 'next-intl/server';
import { PostForm } from '../../PostForm';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  const isEditor = session?.user?.email === 'medlam1981@gmail.com' || (process.env.AUTHORIZED_EDITORS && process.env.AUTHORIZED_EDITORS.includes(session?.user?.email as string));
  if (!isEditor) {
    redirect('/');
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  let initialData = { ...post };
  try {
    const titleObj = JSON.parse(post.title);
    initialData.title = titleObj.en || Object.values(titleObj)[0] || post.title;
  } catch {}
  try {
    const slugObj = JSON.parse(post.slug);
    initialData.slug = slugObj.en || Object.values(slugObj)[0] || post.slug;
  } catch {}
  try {
    const contentObj = JSON.parse(post.content);
    initialData.content = contentObj.en || Object.values(contentObj)[0] || post.content;
  } catch {}

  return <PostForm initialData={initialData} />;
}
