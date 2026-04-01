"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { LayoutDashboard, ShieldCheck, Lock, UserPlus } from "lucide-react";
import Link from "next/link";


export default function LoginPage() {
    // state will contain the { errors, message } returned from loginAction
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 transition-colors duration-300">

            {/* Branding Header */}
            <div className="mb-8 text-center space-y-3">
                <div className="flex justify-center">
                    <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <LayoutDashboard className="text-white" size={32} />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Oftsy <span className="text-brand-primary">RMS</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <ShieldCheck size={14} className="text-zinc-500" />
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            ABH Holdings
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="mb-8">
                    <h2 className="text-xl font-bold tracking-tight">Authorized Access</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Enter your credentials to manage real estate operations.
                    </p>
                </div>

                <form action={formAction} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 ml-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="name@abh-holdings.com"
                            className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        />
                        {state?.errors?.email && (
                            <p className="text-red-500 text-xs font-medium ml-1">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                            />
                            <Lock className="absolute right-4 top-3.5 text-zinc-500" size={18} />
                        </div>
                        {state?.errors?.password && (
                            <p className="text-red-500 text-xs font-medium ml-1">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* Error Message Alert */}
                    {state?.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center animate-in fade-in zoom-in duration-200">
                            {state.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Authorize Portal Access"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-zinc-200 dark:border-zinc-800 pt-6">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                        System Onboarding
                    </p>
                    <Link 
                        href="/register" 
                        className="inline-flex items-center gap-2 text-xs font-black text-brand-primary hover:text-blue-700 transition-colors uppercase tracking-[0.1em]"
                    >
                        <UserPlus size={14} />
                        Initialize Master Account
                    </Link>
                </div>
            </div>


            {/* Security Footer */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">
                    IP Address Logged for Security Audit
                </p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                    Oftsy RMS v1.0.4 • Proprietary Software
                </p>
            </div>
        </main>
    );
}