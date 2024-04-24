'use client'

import React, { useEffect, useState } from 'react';
import { auth, db } from '/firebase-config'; // Make sure this import is correct
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Navbar from '@/components/Navbar';
import UserDashboard from '@/components/UserDashboard';
import ProviderDashboard from '@/components/ProviderDashboard';

function HomePage() {
  const [user, setUser] = useState(null);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch the user data from Firestore
        const userDocRef = doc(db, 'User', authUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Combine authUser data with Firestore data
            setUser({ uid: authUser.uid, ...userDocSnap.data() });
            setIsProvider(userDocSnap.data().is_provider);
          } else {
            // User document does not exist in Firestore
            console.log('No such document in Firestore!');
            setUser(null);
            setIsProvider(false);
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsProvider(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // log user data
  console.log(user);

  return (
    <div className="min-h-screen flex flex-col bg-custom-background">
      <header>
        <Navbar user={user} />
      </header>
      <main className="flex-grow container mx-auto pt-16 pb-4">
        {isProvider ? (
          <ProviderDashboard user={user} />
        ) : (
          <UserDashboard user={user} />
        )}
      </main>
      <footer className="bg-custom-background text-sm text-custom-text text-center p-4">
        <p>© 2024 DBWizards. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
