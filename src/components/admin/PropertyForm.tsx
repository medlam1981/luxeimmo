'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { CustomSelect } from '@/components/ui/CustomSelect';



interface PropertyFormProps {
  initialData?: any;
  actionFn: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  isEdit?: boolean;
}

export function PropertyForm({ initialData, actionFn, isEdit }: PropertyFormProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || 'SALE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    if (initialData?.id) {
      formData.append('id', initialData.id);
    }
    
    try {
      const res = await actionFn(formData);
      
      if (res.success) {
        router.push('/admin/properties');
      } else {
        setError(res.error || 'Failed to save property');
        setLoading(false);
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to find Server Action') || err.message?.includes('fetch failed')) {
        window.location.reload();
      } else {
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    }
  };

  let defaultTitle = '';
  let defaultDesc = '';
  if (initialData) {
    try {
      defaultTitle = JSON.parse(initialData.title).en || initialData.title;
      defaultDesc = JSON.parse(initialData.description).en || initialData.description;
    } catch {
      defaultTitle = initialData.title;
      defaultDesc = initialData.description;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">
        {isEdit ? 'Edit Property' : t('addNewProperty')}
      </h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('propertyTitle')}</label>
          <input required type="text" name="title" defaultValue={defaultTitle} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
          <textarea required name="description" rows={4} defaultValue={defaultDesc} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('price')} (MAD)</label>
            <input required type="number" step="0.01" name="price" defaultValue={initialData?.price} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('city')}</label>
            <input required type="text" name="city" defaultValue={initialData?.city} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude (Optional)</label>
            <input type="number" step="any" name="latitude" defaultValue={initialData?.latitude} placeholder="33.5731" className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude (Optional)</label>
            <input type="number" step="any" name="longitude" defaultValue={initialData?.longitude} placeholder="-7.5898" className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('ownerPhone')}</label>
          <input required type="tel" name="ownerPhone" defaultValue={initialData?.ownerPhone || "+212600000000"} placeholder="+212600000000" className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('propertyType')}</label>
            <CustomSelect
              name="propertyType"
              value={propertyType}
              onChange={setPropertyType}
              options={[
                { value: 'SALE', label: t('forSale') },
                { value: 'RENT', label: t('forRent') }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category')}</label>
            <CustomSelect
              name="category"
              defaultValue={initialData?.category || 'APARTMENT'}
              options={[
                { value: 'APARTMENT', label: t('apartment_name') },
                { value: 'VILLA', label: t('villa_name') },
                { value: 'COMMERCIAL', label: t('commercial_name') },
                { value: 'LAND', label: t('land_name') }
              ]}
            />
          </div>
        </div>

        {propertyType === 'RENT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('rentalPeriod')}</label>
            <CustomSelect
              name="rentalPeriod"
              defaultValue={initialData?.rentalPeriod || 'MONTHLY'}
              options={[
                { value: 'DAILY', label: t('daily') },
                { value: 'MONTHLY', label: t('monthly') }
              ]}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('areaSqm')}</label>
            <input required type="number" name="areaSqm" defaultValue={initialData?.areaSqm} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('bedrooms')}</label>
            <input type="number" name="bedrooms" defaultValue={initialData?.bedrooms} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('bathrooms')}</label>
            <input type="number" name="bathrooms" defaultValue={initialData?.bathrooms} className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('image')} (Max 8) {isEdit && <span className="text-gray-500 text-xs">- Leave blank to keep existing images</span>}</label>
          <input 
            type="file" 
            name="images" 
            multiple
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 8) {
                alert('You can only select up to 8 images.');
                e.target.value = '';
              }
            }}
            className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? t('saving') : (isEdit ? 'Update Property' : t('saveProperty'))}
        </button>
      </form>
    </div>
  );
}
