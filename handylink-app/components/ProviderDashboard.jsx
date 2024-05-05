'use client'

import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import AddService from './AddService';
import ProviderRequestCard from './ProviderRequest';
import ProviderServiceCard from './ProviderService';
import { MdKeyboardArrowDown } from "react-icons/md";

export default function ProviderDashboard(props) {
    const [requests, setRequests] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filter, setFilter] = useState('pending');
    const [selectedOption, setSelectedOption] = useState('Show Pending');
    const [viewMode, setViewMode] = useState('requests');
    const [services, setServices] = useState([]);
    const [serviceIds, setServiceIds] = useState([]);

    const switchView = (mode) => {
        console.log("Switching view to:", mode);  // Debugging output
        setViewMode(mode);
    };    

    const handleAddService = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.options[event.target.selectedIndex].text);
        setFilter(event.target.value);
    };

    const handleAcceptRequest = async (requestId) => {
        const requestRef = doc(db, 'Requests', requestId);
        await updateDoc(requestRef, {
            Status: 'Accepted'
        });
        console.log('Request accepted:', requestId);
        // Optionally, refresh requests or update UI
    };
    
    const handleRejectRequest = async (requestId) => {
        if (window.confirm('Confirm you would like to reject this request')) {
            const requestRef = doc(db, 'Requests', requestId);
            await deleteDoc(requestRef);
            console.log('Request rejected and deleted:', requestId);
            // Optionally, remove the request from the list without a full refresh
            setRequests(prev => prev.filter(request => request.id !== requestId));
        }
    };

    useEffect(() => {
        const getServiceIdFromRequests = () => {
            const ids = [];
            requests.forEach(request => {
                if (!ids.includes(request.ServiceID)) {
                    ids.push(request.ServiceID);
                }
            });
            setServiceIds(ids);
        };

        getServiceIdFromRequests();
    }, [requests]);

    useEffect(() => {
        const fetchServices = async () => {
            console.log("Fetching services for provider:", props.user.uid);  // Debugging output
            const servicesRef = collection(db, 'Services');
            const q = query(servicesRef, where("provider_id", "==", props.user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const fetchedServices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(fetchedServices);
                console.log("Services fetched:", fetchedServices);  // Debugging output
            } else {
                console.log("No services found");  // Debugging output
                setServices([]);
            }
        };
    
        if (viewMode === 'services') {
            fetchServices();
        }
    }, [viewMode, db, props.user.uid]);  

    useEffect(() => {
        const fetchRequests = async () => {
            const providerDoc = doc(db, 'Provider', props.user.uid);
            const providerSnap = await getDoc(providerDoc);
            if (!providerSnap.exists()) {
                console.log('No such provider!');
                return;
            }
            const receivedRequestsIds = providerSnap.data().requests_received || [];
            if (receivedRequestsIds.length > 0) {
                const requestsPromises = receivedRequestsIds.map(requestId => 
                    getDoc(doc(db, 'Requests', requestId))
                );
                const requestsDocs = await Promise.all(requestsPromises);
                const requests = requestsDocs
                    .filter(docSnap => docSnap.exists())
                    .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
                setRequests(requests);
            } else {
                setRequests([]);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-sm">
            <div className="flex justify-between items-center bg-slate-100 p-2 rounded-sm">
                {/* Buttons to switch views */}
                <div className="flex space-x-4 px-4">
                    <button onClick={() => switchView('requests')} className={`text-sm ${viewMode === 'requests' ? 'font-bold text-blue-700' : 'text-gray-500'}`}>
                        View Requests
                    </button>
                    <button onClick={() => switchView('services')} className={`text-sm ${viewMode === 'services' ? 'font-bold text-blue-700' : 'text-gray-500'}`}>
                        View Services
                    </button>
                </div>
                {viewMode === 'requests' && (
                    <div className="relative" style={{ width: `${selectedOption.length + 2}ch` }}>
                        <select 
                            value={filter} 
                            onChange={handleDropdownChange}
                            className="appearance-none block w-full bg-transparent border-none text-sm text-custom-text py-1 pl-3 pr-8 rounded leading-tight focus:outline-none"
                        >
                            <option value="all">Show All</option>
                            <option value="pending">Show Pending</option>
                            <option value="accepted">Show Accepted</option>
                            <option value="completed">Show Completed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-custom-text">
                            <MdKeyboardArrowDown />
                        </div>
                    </div>
                )}
                <button onClick={handleAddService} className="text-blue-500 hover:text-blue-700 px-4 py-2 rounded text-sm">
                    {isModalVisible ? 'Close Modal' : 'Add New Service'}
                </button>
            </div>
            <div className="flex-grow space-y-4">
                {isModalVisible ? (
                    <AddService />
                ) : viewMode === 'requests' ? (
                    console.log(requests),
                    requests.filter(request => filter === 'all' || request.Status.toLowerCase() === filter).map(request => (
                        <ProviderRequestCard
                            key={request.id}
                            request={request}
                            onAccept={() => handleAcceptRequest(request.id)}
                            onReject={() => handleRejectRequest(request.id)}
                        />
                    ))
                ) : (
                    services.map(service => {
                        // If service is not in any active requests, it can be modified
                        const modifiable = !serviceIds.includes(service.id);
                        return <ProviderServiceCard key={service.id} service={service} modifiable={modifiable} />;
                    })
                )}
            </div>
        </div>
    );    
}
