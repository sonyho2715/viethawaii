'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Chrome, Facebook } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setOauthLoading(provider);
    setError('');

    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl mb-4">
              <span className="text-3xl font-black text-white">VH</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to discover Vietnamese businesses in Hawaii</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignIn('google')}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3.5 px-6 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 text-blue-500" />
              )}
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleOAuthSignIn('facebook')}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3.5 px-6 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'facebook' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <Facebook className="w-5 h-5 text-blue-600" />
              )}
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3.5 px-6 rounded-xl font-bold hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-rose-600 hover:text-rose-700 font-bold transition"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
