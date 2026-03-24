"use client"
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import Link from "next/link";
import { useActionState } from "react"; // React 19 / Next.js 15
import { registerAction } from "../action";

export default function Register() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [state, formAction, isPending] = useActionState(registerAction, null as any);

    return (
        <AuthCard title="Create an Account" subtitle="Sign up to start managing your AI agents">
            <form action={formAction} className="mt-8 space-y-6">
                {state?.message && !state?.success && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium shadow-sm">
                        {state.message}
                    </div>
                )}
                {state?.message && state?.success && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm text-center font-medium shadow-sm">
                        {state.message}
                    </div>
                )}

                <div className="space-y-4">
                    <AuthInput 
                        label="Full Name"
                        type="text" 
                        name="name" 
                        placeholder="John Doe" 
                        required 
                        disabled={isPending}
                        error={state?.errors?.name}
                    />
                    
                    <AuthInput 
                        label="Email Address"
                        type="email" 
                        name="email" 
                        placeholder="you@example.com" 
                        required 
                        disabled={isPending}
                        error={state?.errors?.email}
                    />
                    
                    <AuthInput 
                        label="Password"
                        type="password" 
                        name="password" 
                        placeholder="Create a strong password" 
                        required 
                        disabled={isPending}
                        error={state?.errors?.password}
                    />
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                    </div>
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline transition-colors">Terms</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline transition-colors">Privacy Policy</a>
                    </label>
                </div>

                <div className="pt-2">
                    <AuthButton type="submit" isLoading={isPending}>
                        Sign up
                    </AuthButton>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign in instead
                    </Link>
                </p>
            </form>       
        </AuthCard>
    )
}