'use client'

import { useState } from "react";
import { auth } from '/firebase-config';
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent!");
            setEmail("");
            // Redirect to the login page
            router.push('/login');
        } catch (error) {
            console.error(error);
            alert("Error resetting password");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-custom-background">
            <div className="p-8 bg-white rounded shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-accent focus:border-custom-accent"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-custom-accent text-white p-2 rounded hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );    
}