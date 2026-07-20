'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath, revalidateTag } from 'next/cache';
import translate from 'translate';

async function autoTranslate(text: string, isHtml = false): Promise<Record<string, string>> {
  translate.engine = 'google';
  try {
    if (isHtml) {
      const ar = await translateChunked(text, 'ar');
      const fr = await translateChunked(text, 'fr');
      const es = await translateChunked(text, 'es');
      return { en: text, ar, fr, es };
    } else {
      const ar = await translate(text, { to: 'ar' });
      const fr = await translate(text, { to: 'fr' });
      const es = await translate(text, { to: 'es' });
      return { en: text, ar, fr, es };
    }
  } catch (e) {
    console.error('Translation error:', e);
    return { en: text, ar: text, fr: text, es: text };
  }
}

async function translateChunked(html: string, to: string) {
  const chunks = html.split(/(<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|div|blockquote)>)/gi);
  let translated = '';
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].trim() && !/^<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|div|blockquote)>$/i.test(chunks[i])) {
      translated += await translate(chunks[i], { to });
    } else {
      translated += chunks[i];
    }
  }
  return translated;
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createPost(data: any) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Translate fields
    const translatedTitles = await autoTranslate(data.title, false);
    const translatedContents = await autoTranslate(data.content, true);
    
    // Generate localized slugs from localized titles
    const translatedSlugs = {
      en: data.slug || generateSlug(translatedTitles.en),
      ar: generateSlug(translatedTitles.ar),
      fr: generateSlug(translatedTitles.fr),
      es: generateSlug(translatedTitles.es),
    };

    const post = await prisma.post.create({
      data: {
        slug: JSON.stringify(translatedSlugs),
        title: JSON.stringify(translatedTitles),
        content: JSON.stringify(translatedContents),
        coverImage: data.coverImage,
        published: data.published,
        authorId: (session?.user as any).id,
      },
    });
    revalidateTag('post', {});
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath('/', 'layout'); // Revalidate everything just to be safe
    return { success: true, post };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new Error("Post not found");

    let translatedTitles = data.title;
    let translatedContents = data.content;
    let translatedSlugs = data.slug;

    // We only re-translate if the user provides raw string (meaning it was edited in the form)
    // If they submit the already JSON-stringified title, we leave it.
    let needsTranslation = false;
    try {
      JSON.parse(data.title);
    } catch {
      needsTranslation = true;
    }

    if (needsTranslation) {
      const titles = await autoTranslate(data.title, false);
      const contents = await autoTranslate(data.content, true);
      translatedTitles = JSON.stringify(titles);
      translatedContents = JSON.stringify(contents);
      translatedSlugs = JSON.stringify({
        en: data.slug || generateSlug(titles.en),
        ar: generateSlug(titles.ar),
        fr: generateSlug(titles.fr),
        es: generateSlug(titles.es),
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        slug: translatedSlugs,
        title: translatedTitles,
        content: translatedContents,
        coverImage: data.coverImage,
        published: data.published,
      },
    });
    revalidateTag('post', {});
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath('/', 'layout');
    
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidateTag('post', {});
    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
