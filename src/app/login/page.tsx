'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, User, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { siteConfig } from '@/config/site';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const errorParam = searchParams.get('error');

  const { refreshSession } = useDemoBetting();
  const [identifier, setIdentifier] = useState('admin@boundaryx.demo');
  const [password, setPassword] = useState('BoundaryX@Admin2026!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === 'admin_required'
      ? 'Administrator privileges required to access that console.'
      : errorParam === 'login_required'
      ? 'Please sign in to continue.'
      : errorParam === 'session_expired'
      ? 'Your session has expired. Please log in again.'
      : null
  );

  const fillCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setIdentifier('admin@boundaryx.demo');
      setPassword('BoundaryX@Admin2026!');
    } else {
      setIdentifier('user@boundaryx.demo');
      setPassword('CricketFan@2026');
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      // Refresh client session
      await refreshSession();

      // Redirect appropriately
      if (data.user?.role === 'ADMIN' && (redirectPath === '/' || redirectPath.startsWith('/admin'))) {
        router.push(redirectPath.startsWith('/admin') ? redirectPath : '/admin');
      } else {
        router.push(redirectPath);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-[#121820] border border-[#232f38] shadow-2xl">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Sign In to {siteConfig.name}
        </h1>
        <p className="text-xs text-slate-400">
          Secure server-enforced authentication for cricket info & demo credits
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Demo helper credentials selector */}
      <div className="mb-5 p-3 rounded-xl bg-[#182029] border border-[#263342] space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('admin')}
            className="py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Demo Admin
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('user')}
            className="py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <User className="w-3.5 h-3.5" />
            Demo User (0 Credits)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Email Address or Username
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-[#182029] border border-[#263342] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#182029] border border-[#263342] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#263342] text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
          Register new demo profile
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-[#121820] border border-[#232f38] animate-pulse h-96 flex items-center justify-center text-slate-500 text-xs">
          Loading sign in portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
