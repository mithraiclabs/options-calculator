import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

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
