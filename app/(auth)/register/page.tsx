
"use client";

import Link from 'next/link';
import { FaFacebook, FaInstagramSquare, FaGoogle, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

export default function GreenSignupPage() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [role, setRole] = useState<UserRole>(UserRole.USER);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        // Registration successful, redirect to login
        router.push('/login?message=Registration successful! Please sign in.');
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
              Let’s Get Started
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
              <h2 className="text-xl font-semibold mb-8">Sign up</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Your name"
                    className="glass-input-enhanced pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="glass-input-enhanced pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    className="glass-input-enhanced pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    className="glass-input-enhanced pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>

                <select
                  className="glass-input-enhanced"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  required
                >
                  <option value="USER">User</option>
                  <option value="DEPARTMENT">Department</option>
                  <option value="HR">HR</option>
                  <option value="ADMIN">Admin</option>
                </select>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing up...
                    </div>
                  ) : (
                    'Sign up'
                  )}
                </button>

                <p className="text-center text-xs text-emerald-200">
                  Already a Member?{' '}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                    Sign in here
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

