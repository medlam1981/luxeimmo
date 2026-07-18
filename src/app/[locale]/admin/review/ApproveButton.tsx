'use client';

import { useFormStatus } from 'react-dom';
import { approveProperty, rejectProperty, togglePremium } from '@/app/actions/propertyActions';

function SubmitBtn({ label, className }: { label: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-60 disabled:cursor-not-allowed transition-all`}
    >
      {pending ? '...' : label}
    </button>
  );
}

export function ApproveButton({ id, label }: { id: string; label: string }) {
  return (
    <form action={approveProperty.bind(null, id)}>
      <SubmitBtn
        label={label}
        className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700"
      />
    </form>
  );
}

export function RejectButton({ id, label }: { id: string; label: string }) {
  return (
    <form action={rejectProperty.bind(null, id)}>
      <SubmitBtn
        label={label}
        className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700"
      />
    </form>
  );
}

export function PremiumToggle({ id, isPremium, labelPremium, labelUpgrade }: { id: string; isPremium: boolean; labelPremium: string; labelUpgrade: string }) {
  return (
    <form action={togglePremium.bind(null, id, isPremium)}>
      <SubmitBtn
        label={isPremium ? labelPremium : labelUpgrade}
        className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
          isPremium
            ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
        }`}
      />
    </form>
  );
}
