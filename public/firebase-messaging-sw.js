/* eslint-disable no-undef */
// /* eslint-disable no-undef */
// // Scripts for firebase and firebase messaging
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "YOURDATA",
//   authDomain: "YOURDATA",
//   projectId: "YOURDATA",
//   storageBucket: "YOURDATA",
//   messagingSenderId: "YOURDATA",
//   appId: "YOURDATA",
//   measurementId: "YOURDATA",
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAd2B5SdlEGPCgt4NCQt-fL-biLm0cc-Og",
  authDomain: "fcm-try-2f132.firebaseapp.com",
  projectId: "fcm-try-2f132",
  storageBucket: "fcm-try-2f132.appspot.com",
  messagingSenderId: "852133400133",
  appId: "1:852133400133:web:18165ca9f15ab48ded1d2c",
  measurementId: "G-65FJ7ZXN3S",
});

const messaging = firebase.messaging();
