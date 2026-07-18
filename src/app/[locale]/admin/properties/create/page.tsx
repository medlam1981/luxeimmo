import { PropertyForm } from '@/components/admin/PropertyForm';
import { createProperty } from '../new/actions';

export default function CreatePropertyPage() {
  return <PropertyForm actionFn={createProperty} />;
}
