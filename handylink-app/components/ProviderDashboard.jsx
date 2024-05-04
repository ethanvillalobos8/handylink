import React, { useState, useEffect } from 'react';
import AddService from './AddService';

function ProviderDashboard() {
    // Dummy data for services and appointments
    const [services, setServices] = useState([
        { id: 1, name: "Plumbing", description: "Fixing leaks and installing pipes.", rate: "$40/hour" },
        { id: 2, name: "Electrical", description: "Installing electrical systems and troubleshooting.", rate: "$50/hour" },
        { id: 3, name: "House Cleaning", description: "General cleaning services.", rate: "$30/hour" }
    ]);
    const [appointments, setAppointments] = useState([
        { id: 1, service: "Plumbing", client: "John Doe", date: "2023-09-15", status: "Pending" },
        { id: 2, service: "Electrical", client: "Jane Smith", date: "2023-09-17", status: "Approved" }
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddService = () => {
        if (isModalVisible) {
            handleCloseModal();
        } else {
            setIsModalVisible(true);
        }
    };    

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    // Delete a service
    const handleDeleteService = (id) => {
        setServices(services.filter(service => service.id !== id));
    };

    // Approve an appointment
    const handleApproveAppointment = (id) => {
        const updatedAppointments = appointments.map(appointment => 
            appointment.id === id ? { ...appointment, status: 'Approved' } : appointment
        );
        setAppointments(updatedAppointments);
    };

    // Decline an appointment
    const handleDeclineAppointment = (id) => {
        const updatedAppointments = appointments.map(appointment => 
            appointment.id === id ? { ...appointment, status: 'Declined' } : appointment
        );
        setAppointments(updatedAppointments);
    };

    return (
        <div className="min-h-screen bg-custom-background py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">Provider Dashboard</h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {services.map(service => (
                            <div key={service.id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-bold">{service.name}</h3>
                                <p>{service.description}</p>
                                <p className="text-sm font-semibold">{service.rate}</p>
                                <button onClick={() => handleDeleteService(service.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddService} className="mt-4 bg-custom-accent hover:bg-blue-400 text-white px-4 py-2 rounded">
                        {isModalVisible ? 'Close Modal' : 'Add New Service'}
                    </button>
                    {isModalVisible && <AddService />}
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Appointments</h2>
                    <div className="space-y-4">
                        {appointments.map(appointment => (
                            <div key={appointment.id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-bold">{appointment.service}</h3>
                                <p>Client: {appointment.client}</p>
                                <p>Date: {appointment.date}</p>
                                <p>Status: {appointment.status}</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleApproveAppointment(appointment.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Approve
                                    </button>
                                    <button onClick={() => handleDeclineAppointment(appointment.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderDashboard;
