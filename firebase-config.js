/* Top Words — public Firebase Web App config.
 * This is NOT a secret (unlike the Admin SDK service-account key discussed
 * elsewhere) — Firebase's client apiKey/appId are meant to be shipped to
 * the browser. Access control is enforced by Firestore Security Rules
 * (see firestore.rules) + Firebase Authentication, not by hiding this file.
 *
 * Get the real values from:
 *   Firebase Console -> Project Settings -> General -> Your apps
 *   -> (Web app) -> SDK setup and configuration -> Config
 * Replace every REPLACE_ME_* placeholder below, then this file is safe to
 * commit/deploy as-is. Loaded only on profile.html today.
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDnAC7uD3oh-q8egu_cDLFrUcB09C9_n_g",
  authDomain: "udsp-9fedc.firebaseapp.com",
  projectId: "udsp-9fedc",
  storageBucket: "udsp-9fedc.firebasestorage.app",
  messagingSenderId: "254145717909",
  appId: "1:254145717909:web:e65de4a880dcdedec3dd9c",
  measurementId: "G-QYY10GJSSK"
};
