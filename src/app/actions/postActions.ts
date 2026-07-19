'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function createPost(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const post = await prisma.post.create({
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
        published: data.published,
        authorId: session.user.id,
      },
    });
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    return { success: true, post };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
        published: data.published,
      },
    });
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
