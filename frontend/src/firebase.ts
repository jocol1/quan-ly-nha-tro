import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPIDHqo2TIWH3Jic_EEOPR2BIaMCyxmFI",
  authDomain: "quan-ly-tro-3d45d.firebaseapp.com",
  projectId: "quan-ly-tro-3d45d",
  storageBucket: "quan-ly-tro-3d45d.firebasestorage.app",
  messagingSenderId: "285760175010",
  appId: "1:285760175010:web:3ee0c93240bbf1e95e50fb",
  measurementId: "G-8HZXJWGR2M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

