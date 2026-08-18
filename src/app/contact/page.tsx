import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | Defenders of Future Biougra',
  description: 'Get in touch with Defenders of Future association headquarters in Biougra, Morocco.',
};

export default function ContactPage() {
  return (
    <div className="pt-6 sm:pt-8 pb-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            Contact Defenders of Future
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            We welcome partnerships, volunteer inquiries, food package donations, and inquiries regarding our school refurbishment & &ldquo;Spring of Life&rdquo; water projects.
          </p>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
