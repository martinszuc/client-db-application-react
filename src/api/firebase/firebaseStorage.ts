import { getStorage } from 'firebase/storage';
import { app } from '@firebaseDir/firebaseApp';

// Initialize Storage
const storage = getStorage(app);
export default storage;
