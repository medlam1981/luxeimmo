'use client';

import { useState } from 'react';
import { deletePost } from '@/app/actions/postActions';
import { Trash2 } from 'lucide-react';

export function DeletePostButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        const res = await deletePost(id);
        if (!res.success) {
          alert(res.error);
          setIsDeleting(false);
        }
      } catch (err: any) {
        if (err.message?.includes('Failed to find Server Action')) {
          window.location.reload();
        } else {
          alert('An error occurred while deleting the post.');
          setIsDeleting(false);
        }
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
