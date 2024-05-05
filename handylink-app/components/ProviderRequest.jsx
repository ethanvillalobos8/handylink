'use client'

import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function ProviderRequestCard({ request, onAccept, onReject }) {
    request = request;
    // Format the timestamp to a readable date
    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const [serviceName, setServiceName] = useState('');

    useEffect(() => {
        // Function to fetch the service name using ServiceID from the request
        const fetchServiceName = async () => {
            try {
                const serviceRef = doc(db, 'Services', request.ServiceID);
                const serviceSnap = await getDoc(serviceRef);

                if (serviceSnap.exists()) {
                    setServiceName(serviceSnap.data().name);
                } else {
                    console.log('No such service!');
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        if (request.ServiceID) {
            fetchServiceName();
        }
    }, [request.ServiceID]); 

    return (
        <Link className="z-0" href={`/provider/request/${request.ServiceID}+${request.RequestID}`}>
            <div className="grid grid-cols-4 w-full overflow-hidden border-y-2 bg-white">
                <div className='col-span-3'>
                    <div className="flex-row px-6 py-4">
                        <div className="font-bold text-md mb-2">{serviceName}</div>
                        <p className="text-gray-700 text-xs">
                            Scheduled for: {formatDate(request.ScheduleDate)}
                        </p>
                    </div>
                    <div className="flex-row px-6 pb-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2 ${
                            request.Status.toLowerCase() === 'accepted' ? 'bg-green-200 text-green-800' :
                            request.Status.toLowerCase() === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            request.Status.toLowerCase() === 'completed' ? 'bg-green-200 text-green-800' :
                            'bg-gray-200'
                        }`}>
                            {request.Status}
                        </span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                            #{request.ServiceID}
                        </span>
                    </div>
                </div>
                <div className="px-6 text-xs place-self-center">
                    <p className="text-gray-700">
                        Customer: {request.Name}
                    </p>
                    <p className="text-gray-700">
                        Address: {`${request.Address.Street}, ${request.Address.City}, ${request.Address.State}`}
                    </p>
                    <p className="text-gray-700">
                        Phone: {request.PhoneNumber}
                    </p>
                    {request.Status.toLowerCase() === 'pending' && (
                        <div className="mt-4 space-x-6">
                            <button onClick={onAccept} className="z-10 text-green-500 hover:text-green-700 rounded">
                                Accept
                            </button>
                            <button onClick={onReject} className="z-10 text-red-500 hover:text-red-700 rounded">
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
