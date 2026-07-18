'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(
  customerDetails: { fullName: string; phoneNumber: string; city: string; address: string },
  items: { id: string; name: string; price: number; quantity: number }[],
  totalAmount: number
) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phoneNumber,
        city: customerDetails.city,
        address: customerDetails.address,
        totalAmount: totalAmount,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.log('Failed to create order.');
    return { success: false, error: 'Database connection failed. Could not create order.' };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: any) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.log('Failed to update order status.');
    return { success: false, error: 'Database connection failed. Could not update order.' };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.log('Failed to delete order.');
    return { success: false, error: 'Database connection failed. Could not delete order.' };
  }
}
