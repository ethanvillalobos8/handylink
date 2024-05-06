'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Ensure correct import for Next.js router
import Navbar from '@/components/Navbar';
import Link from "next/link";

export default function Account() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user data from Firestore
                const docRef = doc(db, 'User', currentUser.uid);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // Sets user data to state if a user is logged in
                        setUser(docSnap.data());
                    } else {
                        console.log("No such document!");
                        setUser(null); // Set user to null if no document is found
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null); // Handle errors such as permissions issues
                }
            } else {
                // If no user, redirect to login page
                console.log("User is signed out");
                router.push('/login');
            }
        });
    
        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [router]);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Account Details</h1>
                {user ? (
                    <div>
                        <p>Welcome back, {user.displayName || user.username}!</p> {/* Use displayName or username based on what's available */}
                        <p>Email: {user.email}</p>
                        <div className="mt-4">
                            <Link href="/edit-account" passHref>
                                <button className="text-blue-500 hover:underline bg-transparent border-none cursor-pointer p-0">Edit Account Details</button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p>Loading user details...</p>
                )}
            </div>
        </div>
    );
}
