
import Link from 'next/link'
import { FaFacebook, FaInstagramSquare,FaGoogle } from 'react-icons/fa';


export default function GreenSignupPage() {
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

              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Your name"
                  className="glass-input"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="glass-input"
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  className="glass-input"
                />
                <input
                  type="password"
                  placeholder="Repeat password"
                  className="glass-input"
                />

                <button
                  type="submit"
                  className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition"
                >
                  Sign up
                </button>

                <p className="text-center text-xs text-emerald-200">
                  Already a Member?{' '}
                  <Link href="/login" className="text-emerald-400 hover:underline">
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

