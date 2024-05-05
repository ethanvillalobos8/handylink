'use client'

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { db } from '/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from 'next/navigation'

export default function ServiceDetails() {
    const [service, setService] = useState({});
    const [request, setRequest] = useState({});
    const path = usePathname();

    // Format the timestamp to a readable date and time
    const formatDate = (timestamp) => {
        if (timestamp) {
            const date = timestamp.toDate();
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        } else {
            return '';
        }
    };

    // Get the service ID from the URL
    const getServiceIdFromUrl = () => {
        const parts = path.split('/');
        const service_request = parts[parts.length - 1];
        const service_id = service_request.split('+')[0];
        const request_id = service_request.split('+')[1];
        return { service_id, request_id };
    };
    const { service_id, request_id } = getServiceIdFromUrl();

    useEffect(() => {
        const fetchService = async () => {
            if (service_id) {
                try {
                    const serviceDoc = doc(db, 'Services', service_id);
                    const serviceSnap = await getDoc(serviceDoc);
                    if (serviceSnap.exists()) {
                        setService(serviceSnap.data());
                    } else {
                        console.log('No such service!');
                    }
                } catch (error) {
                    console.error('Error fetching service:', error);
                }
            }
        };

        fetchService();
    }, [service_id, db]);

    useEffect(() => {
        const fetchRequest = async () => {
            if (request_id) {
                try {
                    const requestDoc = doc(db, 'Requests', request_id);
                    const requestSnap = await getDoc(requestDoc);
                    if (requestSnap.exists()) {
                        setRequest({
                            ...requestSnap.data(),
                            ScheduleDate: formatDate(requestSnap.data().ScheduleDate)
                        });
                    } else {
                        console.log('No such request!');
                    }
                } catch (error) {
                    console.error('Error fetching request:', error);
                }
            }
        };

        fetchRequest();
    }, [request_id, db]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-custom-background">
                <div className="w-full max-w-4xl p-5 bg-white rounded-lg shadow-lg mt-6">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">{service.name}</h1>
                    <p className="text-sm text-gray-500 mb-4">Service Description: {service.description}</p>
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-medium text-gray-800">Request Details</h2>
                        <p className="text-gray-600">
                            <span className="font-semibold">Scheduled Date:</span> {request.ScheduleDate || 'Loading date...'}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Hourly Rate:</span> {service.hourlyRate}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Client Request:</span> {request.description || 'Loading details...'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
