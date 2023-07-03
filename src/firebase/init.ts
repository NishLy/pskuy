"use client";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd2B5SdlEGPCgt4NCQt-fL-biLm0cc-Og",
  authDomain: "fcm-try-2f132.firebaseapp.com",
  projectId: "fcm-try-2f132",
  storageBucket: "fcm-try-2f132.appspot.com",
  messagingSenderId: "852133400133",
  appId: "1:852133400133:web:18165ca9f15ab48ded1d2c",
  measurementId: "G-65FJ7ZXN3S",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
