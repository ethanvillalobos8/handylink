'use client'

import { useState } from 'react';
import { auth, db } from '/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [username, setUsername] = useState("");

    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "User", user.uid), {
                address: {
                    street: street,
                    city: city,
                    state: state,
                    postal_code: postalCode,
                },
                description: "",
                email: email,
                is_provider: false,
                name: name,
                phone_number: 0,
                profile_image: null,
                registration_date: new Date(),
                requests: [],
                uid: user.uid,
                username: username,
            });
            router.push("/"); // Redirect to the home page
        } catch (error) {
            console.error(error);
        }
    };

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
        <div className="flex flex-col justify-center items-center h-screen bg-custom-background">
            <div className="p-8 bg-white rounded shadow-xl max-w-md w-full">
                <input
                    type="text"
                    placeholder="Name"
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="text"
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="text"
                    placeholder="Street"
                    onChange={e => setStreet(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="text"
                    placeholder="City"
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <select
                    onChange={e => setState(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                >
                    {states.map((state, index) => <option key={index} value={state}>{state}</option>)}
                </select>
                <input
                    type="number"
                    placeholder="Postal Code"
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="email"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                />
                <button
                    onClick={signUp}
                    className="w-full bg-custom-accent text-white p-2 rounded hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-custom-accent"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}