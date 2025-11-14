'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  theme?: 'news' | 'blog';
  icon?: string;
}

export default function NewsletterSignup({
  title = 'Stay Updated',
  description = 'Get the latest updates from Hawaii\'s Vietnamese community',
  theme = 'news',
  icon = '📬'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const gradientClass = theme === 'news'
    ? 'from-rose-500 via-orange-500 to-amber-500'
    : 'from-purple-500 via-pink-500 to-rose-500';

  const buttonTextClass = theme === 'news' ? 'text-rose-600' : 'text-purple-600';
  const buttonHoverClass = theme === 'news' ? 'hover:bg-orange-50' : 'hover:bg-pink-50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // TODO: Implement newsletter subscription API
    // For now, simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className={`bg-gradient-to-r ${gradientClass} rounded-2xl shadow-2xl p-8 text-white`}>
      <div className="text-center">
        <span className="text-5xl mb-4 block">{icon}</span>
        <h3 className="text-2xl font-black mb-3">{title}</h3>
        <p className={`${theme === 'news' ? 'text-orange-100' : 'text-pink-100'} mb-6`}>
          {description}
        </p>

        {status === 'success' ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <p className="font-bold text-white">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`px-6 py-3 bg-white ${buttonTextClass} rounded-lg font-bold ${buttonHoverClass} transition-colors disabled:opacity-50`}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {status === 'error' && (
              <p className="mt-3 text-sm text-white/90 bg-red-500/30 rounded-lg p-2">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
