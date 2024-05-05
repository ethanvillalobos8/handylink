import React from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure you import your db configuration

export default function ProviderServiceCard({ service, modifiable }) {
    // Handler to delete a service after confirmation
    const handleDeleteService = async () => {
        if (window.confirm('Are you sure you want to delete this service? This cannot be undone.')) {
            const serviceRef = doc(db, 'Services', service.id);
            await deleteDoc(serviceRef);
            console.log('Service deleted:', service.id);
            // Optionally, refresh the list of services or use state to remove the deleted service
        }
    };

    // Handler to edit a service
    const handleEditService = () => {
        // This function should ideally navigate to a service edit form or open a modal with the service details
        console.log('Edit service:', service.id);
        // Implement navigation or modal opening logic here
    };

    // Check if the service is editable or deletable
    const isServiceModifiable = modifiable;
    console.log('Service modifiable:', isServiceModifiable);

    return (
        <div className="grid grid-cols-4 w-full overflow-hidden border-y-2 bg-white mb-4">
            <div className='col-span-3'>
                <div className="flex-row px-6 py-4 text-sm">
                    <h3 className="font-bold text-base mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="flex-row px-6 pb-2">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2 ${service.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {service.status ? 'Active' : 'Inactive'}
                    </span>
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                        ${service.hourly_rate}/hr
                    </span>
                </div>
            </div>
            <div className="px-6 text-xs place-self-center">
                <div className="flex space-x-2">
                    <button 
                        onClick={handleEditService} 
                        disabled={!isServiceModifiable} 
                        className={`font-bold py-2 px-4 rounded ${isServiceModifiable ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}>
                        Edit
                    </button>
                    <button 
                        onClick={handleDeleteService} 
                        disabled={!isServiceModifiable} 
                        className={`font-bold py-2 px-4 rounded ${isServiceModifiable ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
