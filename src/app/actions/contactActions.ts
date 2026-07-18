'use server';

import prisma from '@/lib/prisma';
import { sendContactInquiryEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

interface SubmitInquiryInput {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  propertyCity: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}

/** Basic server-side field validation */
function validateInquiry(data: SubmitInquiryInput): string | null {
  if (!data.senderName.trim() || data.senderName.length < 2) {
    return 'Please enter your full name (at least 2 characters).';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.senderEmail)) {
    return 'Please enter a valid email address.';
  }
  if (!data.message.trim() || data.message.length < 10) {
    return 'Please enter a message (at least 10 characters).';
  }
  return null;
}

export async function submitContactInquiry(
  data: SubmitInquiryInput
): Promise<{ success: boolean; error?: string }> {
  // 1. Validate input
  const validationError = validateInquiry(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  // 2. Save the inquiry to the database
  let inquiry;
  try {
    inquiry = await prisma.contactInquiry.create({
      data: {
        propertyId: data.propertyId,
        senderName: data.senderName.trim(),
        senderEmail: data.senderEmail.trim().toLowerCase(),
        senderPhone: data.senderPhone?.trim() || null,
        message: data.message.trim(),
        emailSent: false,
      },
    });
  } catch (dbError) {
    console.error('[contactActions] Failed to save inquiry to DB:', dbError);
    return { success: false, error: 'Failed to save your inquiry. Please try again.' };
  }

  // 3. Fire the admin notification email — failure is non-fatal
  try {
    await sendContactInquiryEmail({
      propertyTitle: data.propertyTitle,
      propertySlug: data.propertySlug,
      propertyCity: data.propertyCity,
      senderName: data.senderName.trim(),
      senderEmail: data.senderEmail.trim().toLowerCase(),
      senderPhone: data.senderPhone?.trim(),
      message: data.message.trim(),
      inquiryId: inquiry.id,
    });

    // Mark email as sent in DB
    await prisma.contactInquiry.update({
      where: { id: inquiry.id },
      data: { emailSent: true },
    });
  } catch (emailError) {
    // Non-fatal: lead is already in the DB — just log the failure
    console.error('[contactActions] Email notification failed (inquiry saved):', emailError);
  }

  // 4. Revalidate the property page to reflect any counters
  revalidatePath(`/properties/${data.propertySlug}`);

  return { success: true };
}
