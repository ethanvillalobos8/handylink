import React, { useState } from 'react';
import { db } from '/firebase-config';
import { addDoc, collection, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { fetchProviderId } from '@/lib/id';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AddService() {
    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [availability, setAvailability] = useState(
        daysOfWeek.reduce((acc, day) => ({
            ...acc,
            [day]: { selected: false, startTime: '', endTime: '' }
        }), {})
    );

    const handleDayToggle = (day) => {
        const updatedDay = {
            ...availability[day],
            selected: !availability[day].selected
        };
        setAvailability({ ...availability, [day]: updatedDay });
    };

    const handleTimeChange = (day, type, value) => {
        const updatedDay = {
            ...availability[day],
            [type]: value
        };
        setAvailability({ ...availability, [day]: updatedDay });
    };

    const addServiceToProvider = async (providerId, serviceId) => {
        try {
            // Fetch the provider's document
            const providerDoc = doc(db, 'Provider', providerId);
            const providerSnap = await getDoc(providerDoc);

            if (!providerSnap.exists()) {
                console.log('No such provider!');
                return;
            }

            // Update the services_offered array with the new service
            await updateDoc(providerDoc, {
                services_offered: arrayUnion(serviceId)
            });

            console.log('Service added to provider successfully');
        } catch (error) {
            console.error('Error adding service to provider:', error);
        }
    };

    const addService = async () => {
        try {
            const providerId = await fetchProviderId();
            const serviceId = uuidv4();
            // Create a new document in the 'Services' collection
            await addDoc(collection(db, 'Services'), {
                name: serviceName,
                category: category,
                description: description,
                hourly_rate: hourlyRate,
                location: {
                    city: city,
                    state: state
                },
                availability: Object.entries(availability)
                    .filter(([, data]) => data.selected)
                    .reduce((acc, [day, { startTime, endTime }]) => ({
                        ...acc,
                        [day]: { startTime, endTime }
                    }), {}),
                status: 'Active',
                provider_id: providerId,
                service_id: serviceId
            });

            // Add the service to the provider's services_offered array
            await addServiceToProvider(providerId, serviceId);

            alert('Service added successfully!');
            setServiceName('');
            setDescription('');
            setCategory('');
            setHourlyRate('');
            setCity('');
            setState('');
            setAvailability(daysOfWeek.reduce((acc, day) => ({
                ...acc,
                [day]: { selected: false, startTime: '', endTime: '' }
            }), {}));
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service.');
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

    const categories = [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Landscaping",
        "Moving",
        "Painting",
        "Carpentry",
        "Handyman",
        "Other"
    ];

    return (
        <div className="min-h-screen bg-custom-background pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Service</h2>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <input type="text" placeholder="Service Name" value={serviceName} onChange={e => setServiceName(e.target.value)} className="p-2 border border-gray-300 rounded" />
                        {/* Location */}
                        <div className="pl-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                            <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="p-2 border border-gray-300 rounded mb-2" />
                            <select
                                onChange={e => setState(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-custom-accent"
                            >
                                {states.map((state, index) => <option key={index} value={state}>{state}</option>)}
                            </select>
                        </div>
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-2 border border-gray-300 rounded" />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Hourly Rate" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-2">Day</th>
                                    <th className="p-2">Available</th>
                                    <th className="p-2">Start Time</th>
                                    <th className="p-2">End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeek.map(day => (
                                    <tr key={day} className="border-t">
                                        <td className="p-2">{day}</td>
                                        <td className="p-2">
                                            <input type="checkbox" checked={availability[day].selected} onChange={() => handleDayToggle(day)} />
                                        </td>
                                        <td className="p-2">
                                            <input type="time" value={availability[day].startTime} onChange={e => handleTimeChange(day, 'startTime', e.target.value)} disabled={!availability[day].selected} className="p-1 border rounded" />
                                        </td>
                                        <td className="p-2">
                                            <input type="time" value={availability[day].endTime} onChange={e => handleTimeChange(day, 'endTime', e.target.value)} disabled={!availability[day].selected} className="p-1 border rounded" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={addService} className="bg-custom-accent hover:bg-blue-400 text-white px-4 py-2 mt-4 rounded">Add Service</button>
                </div>
            </div>
        </div>
    );
}
