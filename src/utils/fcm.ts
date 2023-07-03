// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyAd2B5SdlEGPCgt4NCQt-fL-biLm0cc-Og",
//   authDomain: "fcm-try-2f132.firebaseapp.com",
//   projectId: "fcm-try-2f132",
//   storageBucket: "fcm-try-2f132.appspot.com",
//   messagingSenderId: "852133400133",
//   appId: "1:852133400133:web:18165ca9f15ab48ded1d2c",
//   measurementId: "G-65FJ7ZXN3S",
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
// getToken(messaging, {
//   vapidKey:
//     "BNceUseMWtNcTyfP8asOFYGMAwyHUsZu2AskstRVcDip9yr39OsNGDbRUa1KtMYI0BXcSvHKifErJvgPmmA6Bvs",
// })
//   .then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });

import "firebase/messaging";
import firebase, { initializeApp } from "firebase/app";
import { Messaging, getMessaging, getToken } from "firebase/messaging";
import localforage from "localforage";
// import localforage from "localforage";
const firebaseConfig = {
  apiKey: "AIzaSyAd2B5SdlEGPCgt4NCQt-fL-biLm0cc-Og",
  authDomain: "fcm-try-2f132.firebaseapp.com",
  projectId: "fcm-try-2f132",
  storageBucket: "fcm-try-2f132.appspot.com",
  messagingSenderId: "852133400133",
  appId: "1:852133400133:web:18165ca9f15ab48ded1d2c",
  measurementId: "G-65FJ7ZXN3S",
};

export const app = initializeApp(firebaseConfig);
const firebaseCloudMessaging = {
  init: async () => {
    if (!firebase?.getApps().length) {
      // Initialize the Firebase app with the credentials
      //   firebase?.initializeApp({
      //     apiKey: "your_api_key",
      //     authDomain: "your_auth_domain",
      //     projectId: "your_project_id",
      //     storageBucket: "your_storage_bucket",
      //     messagingSenderId: "your_messagin_sender_id",
      //     appId: "your_app_id",
      //   });

      try {
        const messaging = getMessaging(app);
        const tokenInLocalForage = await localforage.getItem("fcm_token");

        // Return the token if it is alredy in our local storage
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }

        // Request the push notification permission from browser
        const status = await Notification.requestPermission();
        if (status && status === "granted") {
          // Get new token from Firebase
          const fcm_token = await getToken(messaging, {
            vapidKey:
              "BNceUseMWtNcTyfP8asOFYGMAwyHUsZu2AskstRVcDip9yr39OsNGDbRUa1KtMYI0BXcSvHKifErJvgPmmA6Bvs",
          });

          // Set token in our local storage
          if (fcm_token) {
            localforage.setItem("fcm_token", fcm_token);
            return fcm_token;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};
export { firebaseCloudMessaging };
