'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomSelect({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  options
}: {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  options: { label: string; value: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value || '');
  const ref = useRef<HTMLDivElement>(null);
  
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedLabel = options.find(o => o.value === currentValue)?.label || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={ref} className="relative w-full">
      {name && <input type="hidden" name={name} value={currentValue} />}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-gray-50 text-gray-900 transition-colors text-left"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (controlledValue === undefined) setInternalValue(opt.value);
                    if (onChange) onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    currentValue === opt.value
                      ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
