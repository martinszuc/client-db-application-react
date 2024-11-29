// src/services/firebase/firebaseFirestore.ts
import {getFirestore} from 'firebase/firestore';
import app from './firebaseApp';

// Initialize Firestore
const db = getFirestore(app);

export default db;
