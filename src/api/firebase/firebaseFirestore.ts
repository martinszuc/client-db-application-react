import { getFirestore } from 'firebase/firestore';
import { app } from '@firebaseDir/firebaseApp';

// Initialize Firestore
const db = getFirestore(app);
export default db;
