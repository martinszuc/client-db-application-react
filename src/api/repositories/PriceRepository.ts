// src/repositories/PriceRepository.ts

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
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Price } from '@shared/types/Price';
import logger from '@utils/logger';

export class PriceRepository {
    private pricesCollection = collection(db, 'prices');

    // Add a new price
    async addPrice(price: Omit<Price, 'id'>): Promise<string> {
        logger.debug('Attempting to add a new price.', price);
        try {
            // Ensure price is a number or null
            if (price.price !== null && typeof price.price !== 'number') {
                logger.warn('Price is not a number. Converting to number.', { originalPrice: price.price });
                const convertedPrice = Number(price.price);
                if (isNaN(convertedPrice)) {
                    throw new Error('Invalid price value. Must be a number or null.');
                }
                price.price = convertedPrice;
            }

            const docRef = await addDoc(this.pricesCollection, price);
            logger.info('Price added successfully.', { id: docRef.id, price });
            return docRef.id;
        } catch (error) {
            logger.error('Error adding price.', { price, error });
            throw error;
        }
    }

    // Fetch all prices
    async getPrices(): Promise<Price[]> {
        logger.debug('Fetching all prices from Firestore.');
        try {
            const querySnapshot = await getDocs(this.pricesCollection);
            const prices = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                let priceValue = data.price;

                if (priceValue === undefined || priceValue === null) {
                    priceValue = null;
                } else if (typeof priceValue !== 'number') {
                    logger.warn('Price is not a number. Attempting to convert.', { docId: doc.id, priceValue });
                    const convertedPrice = Number(priceValue);
                    if (isNaN(convertedPrice)) {
                        logger.error('Invalid price value in Firestore.', { docId: doc.id, priceValue });
                        priceValue = null; // Set to null if invalid
                    } else {
                        priceValue = convertedPrice;
                    }
                }

                return {
                    id: doc.id,
                    ...data,
                    price: priceValue,
                } as Price;
            });
            logger.info('Fetched prices successfully.', { count: prices.length });
            return prices;
        } catch (error) {
            logger.error('Error fetching prices.', { error });
            throw error;
        }
    }

    // Fetch price by ID
    async getPriceById(priceId: string): Promise<Price> {
        logger.debug('Fetching price by ID.', { priceId });
        try {
            const docRef = doc(db, 'prices', priceId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                logger.warn('Price not found.', { priceId });
                throw new Error(`Price with ID ${priceId} not found.`);
            }
            const data = docSnap.data();
            let priceValue = data.price;

            if (priceValue === undefined || priceValue === null) {
                priceValue = null;
            } else if (typeof priceValue !== 'number') {
                logger.warn('Price is not a number. Attempting to convert.', { priceId, priceValue });
                const convertedPrice = Number(priceValue);
                if (isNaN(convertedPrice)) {
                    logger.error('Invalid price value in Firestore.', { priceId, priceValue });
                    priceValue = null;
                } else {
                    priceValue = convertedPrice;
                }
            }

            const price = { id: docSnap.id, ...data, price: priceValue } as Price;
            logger.info('Fetched price successfully.', { price });
            return price;
        } catch (error) {
            logger.error('Error fetching price by ID.', { priceId, error });
            throw error;
        }
    }

    // Update existing price
    async updatePrice(priceId: string, updatedData: Partial<Price>): Promise<void> {
        logger.debug('Updating price.', { priceId, updatedData });
        try {
            if (updatedData.price !== undefined) {
                if (updatedData.price !== null && typeof updatedData.price !== 'number') {
                    logger.warn('Updated price is not a number. Converting.', { updatedPrice: updatedData.price });
                    const convertedPrice = Number(updatedData.price);
                    if (isNaN(convertedPrice)) {
                        throw new Error('Invalid updated price value. Must be a number or null.');
                    }
                    updatedData.price = convertedPrice;
                }
            }

            const docRef = doc(db, 'prices', priceId);
            await updateDoc(docRef, updatedData);
            logger.info('Price updated successfully.', { priceId, updatedData });
        } catch (error) {
            logger.error('Error updating price.', { priceId, updatedData, error });
            throw error;
        }
    }

    // Delete a price
    async deletePrice(priceId: string): Promise<void> {
        logger.debug('Deleting price.', { priceId });
        try {
            const docRef = doc(db, 'prices', priceId);
            await deleteDoc(docRef);
            logger.info('Price deleted successfully.', { priceId });
        } catch (error) {
            logger.error('Error deleting price.', { priceId, error });
            throw error;
        }
    }

    // Upload photo to Firebase Storage and return the download URL
    async uploadPhoto(file: File, priceId: string): Promise<string> {
        logger.debug('Uploading photo.', { fileName: file.name, priceId });
        try {
            const storageRef = ref(storage, `prices/${priceId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            logger.info('Photo uploaded successfully.', { priceId, downloadURL });
            return downloadURL;
        } catch (error) {
            logger.error('Error uploading photo.', { priceId, fileName: file.name, error });
            throw error;
        }
    }

    // Add photo URL to a price
    async addPhotoUrl(priceId: string, photoUrl: string): Promise<void> {
        logger.debug('Adding photo URL to price.', { priceId, photoUrl });
        try {
            const priceDocRef = doc(db, 'prices', priceId);
            await updateDoc(priceDocRef, {
                photoUrls: arrayUnion(photoUrl),
            });
            logger.info('Photo URL added successfully.', { priceId, photoUrl });
        } catch (error) {
            logger.error('Error adding photo URL.', { priceId, photoUrl, error });
            throw error;
        }
    }

    // Remove photo URL from a price
    async removePhotoUrl(priceId: string, photoUrl: string): Promise<void> {
        logger.debug('Removing photo URL from price.', { priceId, photoUrl });
        try {
            const priceDocRef = doc(db, 'prices', priceId);
            const priceDoc = await getDoc(priceDocRef);
            if (priceDoc.exists()) {
                const currentPhotoUrls = priceDoc.data().photoUrls as string[];
                const updatedPhotoUrls = currentPhotoUrls.filter((url) => url !== photoUrl);
                await updateDoc(priceDocRef, {
                    photoUrls: updatedPhotoUrls,
                });
                logger.info('Photo URL removed successfully.', { priceId, photoUrl });
            } else {
                logger.warn('Price not found for removing photo URL.', { priceId });
                throw new Error(`Price with ID ${priceId} not found.`);
            }
        } catch (error) {
            logger.error('Error removing photo URL.', { priceId, photoUrl, error });
            throw error;
        }
    }
}
