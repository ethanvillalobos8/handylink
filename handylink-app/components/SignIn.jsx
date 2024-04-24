'use client'

import { auth } from '/firebase-config';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the home page
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-custom-background">
            <div className="p-10 bg-white rounded shadow-xl">
                <input
                    type="email"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-custom-accent"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-custom-accent"
                />
                <div className="space-y-4">
                    <button
                        onClick={login}
                        className="w-full px-4 py-2 text-white bg-custom-accent rounded hover:bg-custom-accent focus:outline-none focus:ring"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => router.push('/signup')}
                        className="w-full px-4 py-2 text-blue-700 border border-blue-500 rounded hover:bg-blue-50 focus:outline-none focus:ring"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring"
                    >
                        Forgot Password
                    </button>
                    <button
                        onClick={() => router.push('/provider-apply')}
                        className="w-full px-4 py-2 text-green-700 border border-green-500 rounded hover:bg-green-50 focus:outline-none focus:ring"
                    >
                        Apply to be a Provider
                    </button>
                </div>
            </div>
        </div>
    );
};