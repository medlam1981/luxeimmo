'use client';

import { useState } from 'react';
import { deletePropertyAction } from './actions';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations('Admin');

  const handleDelete = async () => {
    if (confirm(t('deleteConfirm'))) {
      setIsDeleting(true);
      try {
        const res = await deletePropertyAction(id);
        if (!res.success) {
          alert(res.error);
          setIsDeleting(false);
        }
      } catch (err: any) {
        if (err.message?.includes('Failed to find Server Action')) {
          window.location.reload();
        } else {
          alert('An error occurred while deleting the property.');
          setIsDeleting(false);
        }
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? t('deleting') : t('delete')}
    </button>
  );
}
