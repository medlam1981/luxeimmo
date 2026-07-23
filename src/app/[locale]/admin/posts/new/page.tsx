import { setRequestLocale } from 'next-intl/server';
import { PostForm } from '../PostForm';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function NewPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  const isEditor = session?.user?.email === 'medlam1981@gmail.com' || (process.env.AUTHORIZED_EDITORS && process.env.AUTHORIZED_EDITORS.includes(session?.user?.email as string));
  if (!isEditor) {
    redirect('/');
  }

  return <PostForm />;
}
