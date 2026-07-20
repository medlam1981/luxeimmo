import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    revalidatePath('/', 'layout');
    revalidateTag('property');
    revalidateTag('post');
    return NextResponse.json({ success: true, message: 'Global cache completely purged.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
