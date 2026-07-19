'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import translate from 'translate';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function autoTranslate(text: string): Promise<Record<string, string>> {
  translate.engine = 'google';
  try {
    const en = await translate(text, { to: 'en' });
    const ar = await translate(text, { to: 'ar' });
    const fr = await translate(text, { to: 'fr' });
    const es = await translate(text, { to: 'es' });
    return { en, ar, fr, es };
  } catch (e) {
    console.error('Translation error:', e);
    return { en: text, ar: text, fr: text, es: text };
  }
}

export async function createProperty(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) throw new Error("Unauthorized");

    const titleInput = formData.get('title') as string;
    const descriptionInput = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const ownerPhone = formData.get('ownerPhone') as string;
    const propertyType = formData.get('propertyType') as 'RENT' | 'SALE';
    const rentalPeriod = propertyType === 'RENT' ? (formData.get('rentalPeriod') as string) : null;
    const category = formData.get('category') as 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'LAND';
    const city = formData.get('city') as string;
    const areaSqm = parseInt(formData.get('areaSqm') as string, 10);
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string, 10) : null;
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string, 10) : null;
    const latitudeRaw = formData.get('latitude') as string;
    const longitudeRaw = formData.get('longitude') as string;
    const latitude = latitudeRaw ? parseFloat(latitudeRaw) : null;
    const longitude = longitudeRaw ? parseFloat(longitudeRaw) : null;
    
    if (!titleInput || !descriptionInput || isNaN(price) || !city || !ownerPhone) {
      return { success: false, error: 'Missing required fields.' };
    }

    const imageFiles = formData.getAll('images') as File[];
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f.size > 0).slice(0, 8);
      for (const file of validFiles) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (!allowedMimeTypes.includes(file.type)) continue;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Vercel Serverless functions have a read-only filesystem.
        // We convert the image to a Base64 Data URI and store it directly in the database.
        const base64Data = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64Data}`;
        imageUrls.push(dataUri);
      }
    }

    if (imageUrls.length === 0) {
      imageUrls.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80');
    }

    const translatedTitles = await autoTranslate(titleInput);
    const translatedDescriptions = await autoTranslate(descriptionInput);

    const title = JSON.stringify(translatedTitles);
    const description = JSON.stringify(translatedDescriptions);

    // Build slug from the English translation to safely handle Arabic/non-Latin input
    const slugBase = translatedTitles.en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')   // strip non-ASCII
      .trim()
      .replace(/\s+/g, '-')            // spaces → hyphens
      .replace(/-+/g, '-')             // collapse multiple hyphens
      .slice(0, 60)                    // cap length
      || 'property';                   // fallback if entirely non-Latin

    const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

    await prisma.property.create({
      data: {
        userId: (session.user as any).id,
        title,
        slug,
        description,
        price,
        ownerPhone,
        propertyType,
        rentalPeriod,
        category,
        city,
        areaSqm,
        bedrooms,
        bathrooms,
        latitude,
        longitude,
        images: imageUrls
      }
    });

    revalidateTag('property');
    revalidatePath('/admin/properties');
    revalidatePath('/');
    return { success: true };
  } catch (globalError: any) {
    console.error('Action Error:', globalError.message);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

export async function updateProperty(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) throw new Error('Unauthorized');

    const id = formData.get('id') as string;
    const titleInput = formData.get('title') as string;
    const descriptionInput = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const ownerPhone = formData.get('ownerPhone') as string;
    const propertyType = formData.get('propertyType') as 'RENT' | 'SALE';
    const rentalPeriod = propertyType === 'RENT' ? (formData.get('rentalPeriod') as string) : null;
    const category = formData.get('category') as 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'LAND';
    const city = formData.get('city') as string;
    const areaSqm = parseInt(formData.get('areaSqm') as string, 10);
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string, 10) : null;
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string, 10) : null;
    const latitudeRaw = formData.get('latitude') as string;
    const longitudeRaw = formData.get('longitude') as string;
    const latitude = latitudeRaw ? parseFloat(latitudeRaw) : null;
    const longitude = longitudeRaw ? parseFloat(longitudeRaw) : null;
    
    if (!id || !titleInput || !descriptionInput || isNaN(price) || !city || !ownerPhone) {
      return { success: false, error: 'Missing required fields.' };
    }

    // Ownership check
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Property not found.' };
    const role = (session.user as any).role;
    if (existing.userId !== (session.user as any).id && role !== 'ADMIN') {
      return { success: false, error: 'Forbidden.' };
    }

    const imageFiles = formData.getAll('images') as File[];
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f.size > 0).slice(0, 8);
      for (const file of validFiles) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (!allowedMimeTypes.includes(file.type)) continue;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const base64Data = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64Data}`;
        imageUrls.push(dataUri);
      }
    }

    const translatedTitles = await autoTranslate(titleInput);
    const translatedDescriptions = await autoTranslate(descriptionInput);

    const title = JSON.stringify(translatedTitles);
    const description = JSON.stringify(translatedDescriptions);

    const dataToUpdate: any = {
      title,
      description,
      price,
      ownerPhone,
      propertyType,
      rentalPeriod,
      category,
      city,
      areaSqm,
      bedrooms,
      bathrooms,
      latitude,
      longitude,
    };

    if (imageUrls.length > 0) {
      dataToUpdate.images = imageUrls;
    }

    const existingProperty = await prisma.property.findUnique({ where: { id } });
    if (existingProperty?.status === 'REJECTED') {
      dataToUpdate.status = 'PENDING';
    }

    await prisma.property.update({
      where: { id },
      data: dataToUpdate
    });

    revalidateTag('property');
    revalidatePath(`/admin/properties`);
    revalidatePath(`/properties`);
    revalidatePath(`/`);
    return { success: true };
  } catch (globalError: any) {
    console.error('Update Action Error:', globalError.message);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
