'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const auth = getAuth();
    const [user, setUser] = useState(null);

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    };

    // Re-hydration of the user state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    return (
        <nav className="flex justify-center bg-custom-background text-custom-text px-8 py-4 border-b-2 border-[#F7e7f0] w-full h-12">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-semibold tracking-wide">
                    HandyLink
                </div>
                <ul className="flex space-x-4">
                    <Link href='/' className="hover:text-custom-primary p-2 rounded">Home</Link>
                    <Link href='/about' className="hover:text-custom-primary p-2 rounded">About</Link>
                    <Link href='/contact' className="hover:text-custom-primary p-2 rounded">Contact</Link>
                    <Link href='/account' className="hover:text-custom-primary p-2 rounded">Account</Link> {/* added to navbar to see accounts page */}
                    {user ? (
                        <button onClick={logout} className="hover:text-custom-primary p-2 rounded">Logout</button>
                    ) : (
                        <Link href='/login' className="hover:text-custom-primary p-2 rounded">Login</Link>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
