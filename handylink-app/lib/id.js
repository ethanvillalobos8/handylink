// Fetch user id from firestore

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export const fetchUserId = () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'User', user.uid));
                resolve(userDoc.data().uid);
            } else {
                reject('No user is signed in');
            }
        });
    });
}

export const fetchProviderId = () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'User', user.uid));
                if (userDoc.data().is_provider) {
                    const providerDoc = await getDoc(doc(db, 'Provider', user.uid));
                    resolve(providerDoc.data().provider_id);
                } else {
                    reject('User is not a provider');
                }
            } else {
                reject('No user is signed in');
            }
        });
    });
}