"use client";

import { useActionState } from "react";
import { registerAction } from "./actions";
import { UserPlus, ShieldCheck, Lock, Mail, KeyRound } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(registerAction, null);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 transition-colors duration-300">
            
            {/* Branding Header */}
            <div className="mb-8 text-center space-y-3">
                <div className="flex justify-center">
                    <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <UserPlus className="text-white" size={32} />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Oftsy <span className="text-brand-primary">RMS</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <ShieldCheck size={14} className="text-zinc-500" />
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            New Administrative Account
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="mb-8">
                    <h2 className="text-xl font-bold tracking-tight">System Onboarding</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Create a new master account using the Super User password.
                    </p>
                </div>

                <form action={formAction} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
                            New Admin Email
                        </label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@oftsy.com"
                                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pl-11 text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm"
                            />
                            <Mail className="absolute left-4 top-3.5 text-zinc-400" size={16} />
                        </div>
                        {state?.errors?.email && (
                            <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
                            Set Account Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pl-11 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm"
                            />
                            <Lock className="absolute left-4 top-3.5 text-zinc-400" size={16} />
                        </div>
                        {state?.errors?.password && (
                            <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* Super User Password Field */}
                    <div className="pt-2">
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 space-y-3">
                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <KeyRound size={12} />
                                Master Authorization Key
                            </label>
                            <input
                                name="superPassword"
                                type="password"
                                placeholder="Root Authorization Key"
                                required
                                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm font-mono tracking-widest"
                            />
                            {state?.errors?.superPassword && (
                                <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{state.errors.superPassword[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Error Message Alert */}
                    {state?.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center uppercase tracking-wider animate-in fade-in zoom-in duration-200">
                            {state.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em]"
                    >
                        {isPending ? (
                            "Onboarding System..."
                        ) : (
                            "Create Administrator"
                        )}
                    </button>
                    
                    <div className="text-center pt-2">
                        <Link href="/login" className="text-[10px] font-bold text-zinc-500 hover:text-brand-primary uppercase tracking-widest transition-colors">
                            Return to Login Portal
                        </Link>
                    </div>
                </form>
            </div>

            {/* Security Footer */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-black">
                    Hardware Encryption Enabled
                </p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                    Oftsy RMS Security Protocol v4.0
                </p>
            </div>
        </main>
    );
}
