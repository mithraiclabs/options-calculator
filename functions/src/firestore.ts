import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenv from "dotenv";
import { formatDate } from "./util";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: "options-pricing-377004",
  private_key_id: process.env.PRIVATE_KEY_ID,
  // See: https://stackoverflow.com/a/50376092/3403247.
  private_key: (process.env.PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
} as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

export const storeInterestYields = (
  rows: Array<{ [field: string]: string }>
) => {
  const yieldCol = db.collection("yields");
  rows.forEach((row) => {
    const date = row["Date"];
    const yieldDoc = yieldCol.doc(date);
    yieldDoc.set({
      ...row,
      Date: new Date(date),
    });
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
    const priceDoc = priceCol.doc(formatDate(date));
    batch.set(priceDoc, {
      date: date,
      value: JSON.stringify(prices),
    });
  });

  batch.commit();
};

// export const storeVolatility = (coinId: string) => {
//   const volCol = db
//     .collection("coins")
//     .doc(coinId)
//     .collection("historical_volatility");
// };
