import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { Client, Service, ServicePhoto } from '../types/types';


// Collection references
const clientsCollection = collection(db, 'clients');
const servicesCollection = collection(db, 'services');
const servicePhotosCollection = collection(db, 'service_photos');

// Add a new client
export const addClient = async (client: Omit<Client, 'id'>) => {
    const docRef = await addDoc(clientsCollection, client);
    return docRef.id;
};

// Get all clients
export const getClients = async (): Promise<Client[]> => {
    const querySnapshot = await getDocs(clientsCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
};

// Update a client
export const updateClient = async (id: string, data: Partial<Client>) => {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, data);
};

// Delete a client
export const deleteClient = async (id: string) => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
};

// Add a new service
export const addService = async (service: Omit<Service, 'id'>) => {
    const docRef = await addDoc(servicesCollection, service);
    return docRef.id;
};

// Get all services
export const getServices = async (): Promise<Service[]> => {
    const querySnapshot = await getDocs(servicesCollection);
    return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() } as Service)
    );
};

// Update a service
export const updateService = async (id: string, data: Partial<Service>) => {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, data);
};

// Delete a service
export const deleteService = async (id: string) => {
    const docRef = doc(db, 'services', id);
    await deleteDoc(docRef);
};