import { db, storage } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc,
    arrayUnion,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { Client, Service } from '../types/types';

const clientsCollection = collection(db, 'clients');
const servicesCollection = collection(db, 'services');
const servicePhotosCollection = collection(db, 'service_photos');

// Client Functions
export const addClient = async (client: Omit<Client, 'id'>) => {
    try {
        const docRef = await addDoc(clientsCollection, client);
        console.log("Client added with ID: ", docRef.id);  // Log success
        return docRef.id;
    } catch (error) {
        console.error("Error adding client: ", error);  // Log any error
        throw error;  // Re-throw error for handling in the calling component
    }
};

export const getClients = async (): Promise<Client[]> => {
    const querySnapshot = await getDocs(clientsCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
};

export const updateClient = async (id: string, data: Partial<Client>) => {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, data);
};

export const deleteClient = async (id: string) => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
};

// Service Functions
export const addService = async (service: Omit<Service, 'id'>) => {
    try {
        const docRef = await addDoc(servicesCollection, service);
        console.log("Service added with ID: ", docRef.id);  // Log success
        return docRef.id;
    } catch (error) {
        console.error("Error adding service: ", error);  // Log any error
        throw error;  // Re-throw error for handling in the calling component
    }
};

export const getServices = async (): Promise<Service[]> => {
    const querySnapshot = await getDocs(servicesCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service));
};

export const getServicesForClient = async (clientId: string): Promise<Service[]> => {
    const q = query(servicesCollection, where("client_id", "==", clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service));
};

// Photo Functions
export const addPhoto = async (file: File, serviceId: string) => {
    const photoRef = ref(storage, `service_photos/${serviceId}/${file.name}`);
    await uploadBytes(photoRef, file);
    return await getDownloadURL(photoRef);
};

export const getPhotosForService = async (serviceId: string): Promise<string[]> => {
    const q = query(servicePhotosCollection, where("service_id", "==", serviceId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().photoUri as string);
};

export const deletePhoto = async (photoUrl: string) => {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef); // Use deleteObject for storage
};

// Get service by ID
export const getServiceById = async (id: string): Promise<Service> => {
    const docRef = doc(db, 'services', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            date: data.date.toDate(), // Assuming date is a Firestore Timestamp
        } as Service;
    } else {
        throw new Error('Service not found');
    }
};

// Add photos to service
export const addPhotosToService = async (serviceId: string, files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
        const storageRef = ref(storage, `services/${serviceId}/${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(uploadTask.ref);
    });

    const photoUrls = await Promise.all(uploadPromises);

    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
        photoUrls: arrayUnion(...photoUrls), // Assuming photoUrls is an array field in your service document
    });
};

// Delete service
export const deleteService = async (id: string) => {
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
    // Optionally delete photos from storage if needed
};

// Get client by ID
export const getClientById = async (id: string): Promise<Client> => {
    const docRef = doc(db, 'clients', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Client;
    } else {
        throw new Error('Client not found');
    }
};

export const getServicesByClientId = async (clientId: string): Promise<Service[]> => {
    const q = query(servicesCollection, where('client_id', '==', clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
    } as Service));
};
