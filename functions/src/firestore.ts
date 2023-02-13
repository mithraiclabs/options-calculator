import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp({ credential: cert("../firebaseSA.json") });
const db = getFirestore();

export const storeCoinPrices = (coinPrices: {
  [id: string]: Array<Array<number>>;
}) => {
  const batch = db.batch();

  Object.entries(coinPrices).forEach(([id, prices]) => {
    const priceCol = db.collection("coins").doc(id).collection("prices");
    prices.forEach(([timestamp, price]) => {
      const priceRef = priceCol.doc()
      batch.set(priceRef, {
        price: price,
        timestamp: Timestamp.fromMillis(timestamp)
      })
    })
  });

  batch.commit();
};
