import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  projectId: "webbed-team",
  appId: "1:358511225804:web:81f3e87f6fb4d8c93f0b69",
  storageBucket: "webbed-team.firebasestorage.app",
  apiKey: "AIzaSyCO00NHpuLkF1RtzSpUNnOfcnSFXMk-mWI",
  authDomain: "webbed-team.firebaseapp.com",
  messagingSenderId: "358511225804",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function writeSubscription(email: string): Promise<void> {
  const subscribersRef = collection(db, "subscribers");
  await addDoc(subscribersRef, {
    email,
    subscribedAt: Timestamp.now(),
  });
}

export { db };
