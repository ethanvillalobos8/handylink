'use client'

import { useState } from 'react';
import { db } from '/firebase-config'; // Adjust the import path as needed
import { doc, setDoc, getDocs, query, where, collection, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProviderApply() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [service, setService] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const apply = async () => {
        // Validation for empty fields
        if (!email || !name || !service || !city || !state || !description || !phoneNumber) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        setErrorMessage('');

        try {
            // Check if the email is associated with an existing user account
            const usersQuery = query(collection(db, 'User'), where('email', '==', email));
            const usersSnapshot = await getDocs(usersQuery);

            if (usersSnapshot.empty) {
                setErrorMessage('No account exists with this email. Please create an account first.');
                return;
            }

            // Check if the email is already associated with a provider
            const providersQuery = query(collection(db, 'Provider'), where('email', '==', email));
            const providersSnapshot = await getDocs(providersQuery);

            if (!providersSnapshot.empty) {
                setErrorMessage('An account with this email is already a provider.');
                return;
            }

            // Use the user's UID from the User collection for the provider document
            const userDocRef = usersSnapshot.docs[0].ref;
            const providerId = userDocRef.id;

            // Create the provider document
            await setDoc(doc(db, 'Provider', providerId), {
                address: {
                    street: street,
                    city: city,
                    state: state,
                    postal_code: postalCode,
                },
                name,
                email,
                service_name: service,
                description,
                phone_number: phoneNumber,
                approved: true, // Auto-approve for now
                registration_date: new Date(),
                requests_received: [],
                services_offered: [],
                appointments: [],
                provider_id: providerId
            });

            // Update the User document's is_provider field
            await updateDoc(userDocRef, {
                is_provider: true
            });

            // Reset fields and navigate home
            setEmail('');
            setName('');
            setService('');
            setCity('');
            setState('');
            setDescription('');
            setPhoneNumber('');
            router.push('/');
        } catch (error) {
            console.error('Error applying to be a provider:', error);
            setErrorMessage('Failed to submit application. Please try again.');
        }
    };

    // States array for the dropdown
    const states = [
        "AL", "AK", "AZ", "AR", "CA",
        "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH",
        "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT",
        "VA", "WA", "WV", "WI", "WY"
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-custom-background">
            <div className="p-8 bg-white rounded shadow-xl max-w-md w-full space-y-4">
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input 
                    type="text" 
                    placeholder="Service" 
                    value={service} 
                    onChange={e => setService(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input 
                    type="text" 
                    placeholder="City" 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <select 
                    value={state} 
                    onChange={e => setState(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                    defaultValue=""
                >
                    <option value="" disabled>Select State</option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
                <input 
                    type="number" 
                    placeholder="Postal Code" 
                    value={postalCode} 
                    onChange={e => setPostalCode(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input 
                    type="text" 
                    placeholder="Phone Number" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <button 
                    onClick={apply} 
                    className="w-full bg-custom-accent text-white p-2 rounded hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-custom-accent"
                >
                    Apply to be a Provider
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <p className="mt-4 text-custom-text">
                    Don&apos;t have an account yet? <Link className="text-custom-accent" href="/signup">Create one here</Link>
                </p>
            </div>
        </div>
    );    
}
