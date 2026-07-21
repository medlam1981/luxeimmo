'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { createPost, updatePost } from '@/app/actions/postActions';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function PostForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    published: initialData?.published || false,
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData({ ...formData, coverImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!initialData) {
      setFormData({ ...formData, title, slug: generateSlug(title) });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = initialData
        ? await updatePost(initialData.id, formData)
        : await createPost(formData);

      if (res.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(res.error || 'Failed to save post');
        setLoading(false);
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to find Server Action')) {
        window.location.reload();
      } else {
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6 w-full">
      <div className="flex items-center mb-4 md:mb-6">
        <Link href="/admin/posts" className="p-2 mr-4 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
          {initialData ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 md:p-6 space-y-4 md:space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug (URL)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                placeholder="e.g. legal-guide-morocco"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image {initialData?.coverImage ? '(Upload new to replace)' : ''}</label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp, image/avif"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
            />
            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <img src={formData.coverImage} alt="Cover Preview" className="h-32 w-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:ring-offset-gray-900 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label htmlFor="published" className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
              Publish this post immediately
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-sm disabled:opacity-50 min-w-[140px]"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
