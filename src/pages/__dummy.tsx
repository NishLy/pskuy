import React, { useEffect } from "react";
import "firebase/messaging";
import { app, firebaseCloudMessaging } from "../utils/fcm";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { ScriptProps } from "next/script";
import { getMessaging, onMessage } from "firebase/messaging";

function PushNotificationLayout({ children }: ScriptProps) {
  const router = useRouter();
  useEffect(() => {
    setToken();

    // Event listener that listens for the push notification event in the background
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event);
      });
    }

    // Calls the getMessage() function if the token is there
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("token", token);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  // Handles the click function on the toast showing push notification
  const handleClickPushNotification = (url: string) => {
    router.push(url);
  };

  // Get the push notification message and triggers a toast to display it
  function getMessage() {
    const messaging = getMessaging();

    const topic = "highScores";

    const message = {
      data: {
        score: "850",
        time: "2:45",
      },
      topic: topic,
    };

    // Send a message to devices subscribed to the provided topic.
    // getMessaging()
    //   .send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log("Successfully sent message:", response);
    //   })
    //   .catch((error) => {
    //     console.log("Error sending message:", error);
    //   });

    console.log(messaging);
    onMessage(messaging, (message) => {
      console.log(message);
      toast(
        <div
          onClick={() =>
            handleClickPushNotification(message?.data?.url as string)
          }
        >
          <h5>{message?.notification?.title}</h5>
          <h6>{message?.notification?.body}</h6>
        </div>,
        {
          closeOnClick: false,
        }
      );
    });
  }

  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}

export default PushNotificationLayout;
