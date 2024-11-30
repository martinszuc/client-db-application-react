// src/repositories/ClientRepository.ts

import db from '../firebase/firebaseFirestore';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc,} from 'firebase/firestore';
import {Client} from '@shared/types';

export class ClientRepository {
    private clientsCollection = collection(db, 'clients');

    async addClient(client: Omit<Client, 'id'>): Promise<string> {
        console.log('Adding client:', client);
        const docRef = await addDoc(this.clientsCollection, client);
        console.log('Client added with ID:', docRef.id);
        return docRef.id;
    }

    async getClients(): Promise<Client[]> {
        console.log('Fetching clients...');
        const querySnapshot = await getDocs(this.clientsCollection);
        const clients: Client[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Client));
        console.log(`Fetched ${clients.length} clients.`);
        return clients;
    }

    async getClientById(clientId: string): Promise<Client> {
        console.log(`Fetching client by ID: ${clientId}`);
        const docRef = doc(db, 'clients', clientId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Client with ID ${clientId} not found.`);
        }

        const client = { id: docSnap.id, ...docSnap.data() } as Client;
        console.log('Fetched client:', client);
        return client;
    }

    async updateClient(clientId: string, updatedData: Partial<Client>): Promise<void> {
        console.log(`Updating client ${clientId} with data:`, updatedData);
        const docRef = doc(db, 'clients', clientId);
        await updateDoc(docRef, updatedData);
        console.log('Client updated successfully.');
    }

    async deleteClient(clientId: string): Promise<void> {
        console.log(`Deleting client with ID: ${clientId}`);
        const docRef = doc(db, 'clients', clientId);
        await deleteDoc(docRef);
        console.log('Client deleted successfully.');
    }
}
