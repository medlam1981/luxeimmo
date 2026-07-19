import { setRequestLocale } from 'next-intl/server';
import { PostForm } from '../PostForm';

export default async function NewPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PostForm />;
}
