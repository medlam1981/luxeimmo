'use client';

import { useSession, signIn } from 'next-auth/react';
import { Mail, Phone } from 'lucide-react';

export function SecureContactButton({ 
  type, 
  value, 
  label 
}: { 
  type: 'email' | 'phone', 
  value: string, 
  label: string 
}) {
  const { status } = useSession();

  const handleClick = () => {
    if (status === 'authenticated') {
      window.location.href = type === 'email' ? `mailto:${value}` : `tel:${value}`;
    } else {
      signIn('google');
    }
  };

  return (
    <button onClick={handleClick} className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-start w-full">
      <div className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm shrink-0">
        {type === 'email' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}
