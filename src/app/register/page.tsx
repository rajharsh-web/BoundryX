'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshSession } = useDemoBetting();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Refresh client session
      await refreshSession();

      // Redirect to wallet (which shows 0 credits)
      router.push('/wallet');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-[#121820] border border-[#232f38] shadow-2xl">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Create Demo Account
        </h1>
        <p className="text-xs text-slate-400">
          Set up your verified profile for simulated cricket markets
        </p>
      </div>

      <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Mandatory Rule:</strong> All new accounts start with strictly <strong>0 DEMO credits</strong>. An authorized administrator must manually allocate credits before you can place simulated bets.
        </span>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-[#182029] border border-[#263342] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. BoundaryStriker"
            className="w-full bg-[#182029] border border-[#263342] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. striker@example.com"
            className="w-full bg-[#182029] border border-[#263342] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Password (min 8 chars, 1 uppercase, 1 number)
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
              Creating Profile...
            </>
          ) : (
            'Register Account (0 Credits)'
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#263342] text-center text-xs text-slate-400">
        Already have a profile?{' '}
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
