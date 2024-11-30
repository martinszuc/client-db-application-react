// src/services/firebase/firebaseStorage.ts
import {getStorage} from 'firebase/storage';
import {app} from './firebaseApp';

// Initialize Storage
const storage = getStorage(app);

export default storage;
