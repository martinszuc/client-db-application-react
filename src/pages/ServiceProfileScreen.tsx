import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getServiceById, deleteService, addPhotosToService, getClientById} from '../services/firestoreService';
import { Service } from '../types/types';
import ServiceProfileContent from '../components/ServiceProfileContent';

const ServiceProfileScreen: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [clientName, setClientName] = useState('Unknown Client');

    useEffect(() => {
        const fetchService = async () => {
            if (serviceId) {
                const serviceData = await getServiceById(serviceId);
                setService(serviceData);
                // Fetch client name based on serviceData.clientId
                const clientData = await getClientById(serviceData.clientId);
                setClientName(clientData.name);
            }
        };
        fetchService();
    }, [serviceId]);

    const handleDeleteService = async () => {
        if (serviceId) {
            await deleteService(serviceId);
            navigate('/services'); // Navigate back to services list
        }
    };

    const handleAddPhotos = async (files: FileList) => {
        if (serviceId) {
            await addPhotosToService(serviceId, files);
            // Refresh service data to show new photos
            const serviceData = await getServiceById(serviceId);
            setService(serviceData);
        }
    };

    return service ? (
        <ServiceProfileContent
            service={service}
            clientName={clientName}
            onDeleteService={handleDeleteService}
            onAddPhotos={handleAddPhotos}
        />
    ) : (
        <div>Loading...</div>
    );
};

export default ServiceProfileScreen;
