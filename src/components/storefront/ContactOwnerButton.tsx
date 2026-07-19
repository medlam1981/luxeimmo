'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Star, X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { submitRating } from '@/app/actions/ratingActions';
import { submitContactInquiry } from '@/app/actions/contactActions';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactOwnerButtonProps {
  propertyId: string;
  ownerPhone: string;
  propertyTitle: string;
  propertyCity: string;
  propertySlug: string;
}

type ModalStep = 'form' | 'submitting' | 'success' | 'error' | 'rating' | 'ratingSuccess';

export function ContactOwnerButton({
  propertyId,
  ownerPhone,
  propertyTitle,
  propertyCity,
  propertySlug,
}: ContactOwnerButtonProps) {
  const t = useTranslations('Property');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ModalStep>('form');
  const [errorMsg, setErrorMsg] = useState('');

  // Inquiry form state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState('');

  // Rating state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [whatsappUrl, setWhatsappUrl] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Build the WhatsApp URL client-side to safely access window.location
  useEffect(() => {
    const msg = `Hello, I'm interested in "${propertyTitle}" in ${propertyCity}. Can you provide more details? Link: ${window.location.origin}/properties/${propertySlug}`;
    const cleanPhone = ownerPhone.replace(/[^\d+]/g, '');
    setWhatsappUrl(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`);
  }, [propertyTitle, propertyCity, propertySlug, ownerPhone]);

  // Pre-fill the message
  useEffect(() => {
    setMessage(`Hello, I'm interested in "${propertyTitle}" located in ${propertyCity}. Could you please provide more information?`);
  }, [propertyTitle, propertyCity]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (showModal && step === 'form') {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [showModal, step]);

  const resetModal = () => {
    setStep('form');
    setErrorMsg('');
    setRating(0);
    setHoverRating(0);
  };

  const handleOpenModal = () => {
    resetModal();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(resetModal, 300); // Wait for exit animation
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');

    try {
      const result = await submitContactInquiry({
        propertyId,
        propertySlug,
        propertyTitle,
        propertyCity,
        senderName,
        senderEmail,
        senderPhone,
        message,
      });

      if (result.success) {
        setStep('success');
        // After showing success, transition to rating after 1.5s
        setTimeout(() => setStep('rating'), 1800);
      } else {
        setErrorMsg(result.error || 'Something went wrong. Please try again.');
        setStep('error');
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to find Server Action')) {
        window.location.reload();
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
        setStep('error');
      }
    }
  };

  const handleRatingSubmit = async () => {
    if (rating > 0) {
      try {
        await submitRating(propertyId, rating);
        setStep('ratingSuccess');
        setTimeout(() => handleClose(), 2000);
      } catch (err: any) {
        if (err.message?.includes('Failed to find Server Action')) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <>
      {/* Primary CTA button */}
      <button
        onClick={handleOpenModal}
        className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl transition-colors duration-300 font-medium text-lg shadow-lg hover:shadow-xl cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 mr-3" />
        {t('contactAgent')}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full relative shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-0 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step === 'rating' || step === 'ratingSuccess'
                      ? t('rateExperience')
                      : 'Contact Agent'}
                  </h2>
                  {(step === 'form' || step === 'submitting') && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-snug">
                      {propertyTitle} · {propertyCity}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 -mt-1 -mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 pb-8 pt-6">

                {/* ── INQUIRY FORM ── */}
                {(step === 'form' || step === 'submitting') && (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="ci-name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="ci-name"
                        ref={firstInputRef}
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        minLength={2}
                        placeholder="e.g. Ahmed Benali"
                        disabled={step === 'submitting'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="ci-email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="ci-email"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        disabled={step === 'submitting'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60"
                      />
                    </div>

                    {/* Phone (optional) */}
                    <div>
                      <label htmlFor="ci-phone" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-gray-400 font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        id="ci-phone"
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="+212 600 000 000"
                        disabled={step === 'submitting'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="ci-message" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="ci-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        minLength={10}
                        rows={3}
                        disabled={step === 'submitting'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={step === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {step === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Inquiry
                        </>
                      )}
                    </button>

                    {/* Also contact via WhatsApp */}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-medium py-3 rounded-xl hover:bg-[#25D366]/5 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Or contact via WhatsApp
                      </a>
                    )}
                  </form>
                )}

                {/* ── SUCCESS ── */}
                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Inquiry Sent!</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      The agent has been notified and will respond to <strong>{senderEmail}</strong> shortly.
                    </p>
                  </motion.div>
                )}

                {/* ── ERROR ── */}
                {step === 'error' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
                    </div>
                    <button
                      onClick={() => setStep('form')}
                      className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ── RATING ── */}
                {step === 'rating' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      How would you rate your experience with this listing?
                    </p>
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleRatingSubmit}
                        disabled={rating === 0}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {t('submit')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── RATING SUCCESS ── */}
                {step === 'ratingSuccess' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('ratingSuccess')}
                    </h3>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
