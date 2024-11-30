// src/repositories/SlideRepository.ts

import db from '@firebaseDir/firebaseFirestore';
import storage from '@firebaseDir/firebaseStorage';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc} from 'firebase/firestore';
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Slide} from '@shared/types';

export class SlideRepository {
    private slidesCollection = collection(db, 'slides');

    // Add a new slide and return the complete Slide object
    async addSlide(slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File): Promise<Slide> {
        const now = new Date();

        // Upload the image and get the URL
        const imageRef = ref(storage, `slides/images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        // Create the slide object
        const slideData = {
            ...slide,
            imageUrl,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(this.slidesCollection, slideData);

        const newSlide: Slide = {
            id: docRef.id,
            ...slideData,
        };

        return newSlide;
    }

    // Get all slides ordered by `order`
    async getSlides(): Promise<Slide[]> {
        const q = query(this.slidesCollection, orderBy('order'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Slide, 'id'>),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
        }));
    }

    // Get a specific slide by ID
    async getSlideById(slideId: string): Promise<Slide> {
        const docRef = doc(this.slidesCollection, slideId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Slide with ID ${slideId} not found.`);
        }

        return {
            id: docSnap.id,
            ...(docSnap.data() as Omit<Slide, 'id'>),
            createdAt: docSnap.data().createdAt.toDate(),
            updatedAt: docSnap.data().updatedAt.toDate(),
        };
    }

    // Update a slide
    async updateSlide(slideId: string, updatedData: Partial<Omit<Slide, 'id' | 'createdAt'>>): Promise<void> {
        const docRef = doc(this.slidesCollection, slideId);
        const now = new Date();

        await updateDoc(docRef, {
            ...updatedData,
            updatedAt: now,
        });
    }

    // Delete a slide and its associated image
    async deleteSlide(slideId: string, imagePath: string): Promise<void> {
        // Delete the slide document
        const docRef = doc(this.slidesCollection, slideId);
        await deleteDoc(docRef);

        // Delete the image from storage
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    }
}
