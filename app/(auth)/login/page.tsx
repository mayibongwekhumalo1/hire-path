"use client";

import Link from 'next/link';
import { FaFacebook, FaInstagramSquare, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GreenLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard/hires');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f14] flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/40">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Left section */}
          <div className="p-12 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-semibold tracking-tight">
               Get Started
            </h1>
            <p className="mt-4 max-w-md text-sm text-emerald-200/80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Maecenas placerat ultricies libero eu pharetra. Vestibulum a
              ultricies augue.
            </p>

            <div className="mt-auto pt-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-medium text-black">
                presented by
                <span className="font-bold text-emerald-600">Sanna</span>
              </span>
            </div>
          </div>

          {/* Right form */}
          <div className="p-12 flex items-center">
            <div className="w-full max-w-sm ml-auto text-white">
              <h2 className="text-xl font-semibold mb-8">Sign in</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="glass-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Your Password"
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                <p className="text-center text-xs text-emerald-200">
                  Don 't have an account?{' '}
                  <Link href="/register" className="text-emerald-400 hover:underline">
                    Sign up here
                  </Link>
                </p>
              </form>

              {/* Social icons */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4">
                {[
                  { Icon: FaFacebook, key: 'facebook' },
                  {Icon: FaInstagramSquare, key: 'instagram'},
                  { Icon: FaGoogle, key: 'google' }
                ].map(({ Icon, key }) => (
                  <div
                    key={key}
                    className="h-9 w-9 rounded-full border border-white/40 flex items-center justify-center"
                  >
                    <Icon />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}