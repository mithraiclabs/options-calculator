import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ credential: cert("../firebaseSA.json") });
const db = getFirestore();

export const storeInterestYields = (
  rows: Array<{ [field: string]: string }>
) => {
  const yieldCol = db.collection("yields");
  rows.forEach((row) => {
    const date = row["Date"];
    const yieldDoc = yieldCol.doc(date);
    yieldDoc.set(row);
  });
};

export const storeCoinPrices = (
  coinPrices: {
    [id: string]: Array<Array<number>>;
  },
  date: Date
) => {
  const batch = db.batch();

  Object.entries(coinPrices).forEach(([id, prices]) => {
    const priceCol = db.collection("coins").doc(id).collection("prices");
    const priceDoc = priceCol.doc();
    batch.set(priceDoc, {
      date: date,
      value: JSON.stringify(prices),
    });
  });

  batch.commit();
};

export const storeVolatility = (coinId: string) => {
  const volCol = db
    .collection("coins")
    .doc(coinId)
    .collection("historical_volatility");
};
