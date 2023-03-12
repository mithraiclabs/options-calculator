import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { mergePriceData } from "./strings";

const db = getFirestore();

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
