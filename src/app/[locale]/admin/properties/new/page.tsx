// Server Component — no 'use client' directive needed.
// Server actions can be passed as props directly from Server Components.
import { PropertyForm } from '@/components/admin/PropertyForm';
import { createProperty } from './actions';

export default function NewPropertyPage() {
  return <PropertyForm actionFn={createProperty} />;
}
