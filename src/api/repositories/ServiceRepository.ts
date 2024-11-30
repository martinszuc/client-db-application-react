import db from '../firebase/firebaseFirestore';
import storage from '../firebase/firebaseStorage';
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Service} from '@shared/types';

export class ServiceRepository {
    private servicesCollection = collection(db, 'services');

    async addService(service: Omit<Service, 'id'>): Promise<string> {
        console.log('Adding service:', service);
        const docRef = await addDoc(this.servicesCollection, service);
        console.log('Service added with ID:', docRef.id);
        return docRef.id;
    }

    async getServices(): Promise<Service[]> {
        console.log('Fetching services...');
        const querySnapshot = await getDocs(this.servicesCollection);
        const services: Service[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const service: Service = {
                id: doc.id,
                name: data.name || 'Untitled Service', // Added this line
                clientId: data.clientId || '',
                description: data.description || 'No description',
                price: data.price || 0,
                date: data.date?.toDate() || new Date(),
                photoUrls: data.photoUrls || [],
            };
            console.log('Fetched service:', service);
            return service;
        });
        console.log(`Fetched ${services.length} services.`);
        return services;
    }

    async getServicesByClientId(clientId: string): Promise<Service[]> {
        console.log(`Fetching services for client ID: ${clientId}`);
        const q = query(this.servicesCollection, where('clientId', '==', clientId));
        const querySnapshot = await getDocs(q);

        const services: Service[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const service: Service = {
                id: doc.id,
                name: data.name || 'Untitled Service',
                clientId: data.clientId || '',
                description: data.description || 'No description',
                price: data.price || 0,
                date: data.date?.toDate() || new Date(),
                photoUrls: data.photoUrls || [],
            };
            console.log('Fetched service for client:', service);
            return service;
        });

        console.log(`Fetched ${services.length} services for client ID ${clientId}.`);
        return services;
    }

    async getServiceById(serviceId: string): Promise<Service> {
        console.log(`Fetching service by ID: ${serviceId}`);
        const docRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Service with ID ${serviceId} not found.`);
        }

        const data = docSnap.data();
        const service: Service = {
            id: docSnap.id,
            name: data.name || 'Untitled Service', // Added this line
            clientId: data.clientId || '',
            description: data.description || 'No description',
            price: data.price || 0,
            date: data.date?.toDate() || new Date(),
            photoUrls: data.photoUrls || [],
        };
        console.log('Fetched service:', service);
        return service;
    }

    async uploadPhoto(file: File, serviceId: string): Promise<string> {
        console.log(`Uploading photo for service ID: ${serviceId}`);
        const storageRef = ref(storage, `services/${serviceId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Photo uploaded. URL:', downloadURL);
        return downloadURL;
    }

    async addPhotosToService(serviceId: string, photoUrls: string[]): Promise<void> {
        console.log(`Adding photos to service ID: ${serviceId}`);
        const serviceDocRef = doc(db, 'services', serviceId);
        await updateDoc(serviceDocRef, {
            photoUrls: arrayUnion(...photoUrls),
        });
        console.log('Photos added to service successfully.');
    }

    async deleteService(serviceId: string): Promise<void> {
        console.log(`Deleting service with ID: ${serviceId}`);
        const docRef = doc(db, 'services', serviceId);
        await deleteDoc(docRef);
        console.log('Service deleted successfully.');
        // Optionally, handle deletion of associated photos from storage
    }
}
