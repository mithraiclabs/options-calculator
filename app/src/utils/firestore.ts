import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { mergePriceData } from "./strings";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getLatestInterestYields = async () => {
  const interestRef = collection(db, "yields");
  const q = query(interestRef, orderBy("Date", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return data[0];
};

export const getPrices = async (token: string, lookback: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - lookback);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const priceRef = collection(db, "/coins/" + token + "/prices");
  const q = query(
    priceRef,
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "asc")
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.reduce((acc: number[][], cur) => {
    return mergePriceData(acc, JSON.parse(cur.data().value));
  }, []);

  return data;
};
