/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Fab } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { ScriptProps } from "next/script";
import AppContext from "@/context/app";
import RedirectSignin from "../__components/redirect_signin";

const defaultProps = {
  center: {
    lat: -6.888701,
    lng: 109.668289,
  },
  zoom: 15,
};

type Props = {
  defaultMapsProp?: {
    center: {
      Iat: number;
      Ing: number;
    };
  };
  moveable?: boolean;
  controlled?: {
    markerOnChange: () => void;
  };
} & ScriptProps;

export default function Page(props: Props) {
  const [userContext] = React.useContext(AppContext);
  if (!userContext?.token || !userContext?.uuid) return <RedirectSignin />;

  const mapRef = React.useRef();
  let map: google.maps.Map;
  let infoWindow: google.maps.InfoWindow;

  React.useEffect(() => {
    map = new window.google.maps.Map(
      mapRef.current ?? document.querySelector("#mapWrapper")!,
      defaultProps
    );

    infoWindow = new window.google.maps.InfoWindow();

    const marker = new google.maps.Marker({
      position: {
        lat: -6.888701,
        lng: 109.668289,
      },
      draggable: props.moveable,
      animation: google.maps.Animation.DROP,
      map: map,
    });

    props.controlled &&
      google.maps.event.addListener(marker, "dragend", () => {
        if (!marker.getPosition()) return;
        map.setCenter(marker.getPosition()!);
        props.controlled && props.controlled.markerOnChange();
      });
  });

  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  function handleClickCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Lokasi Anda.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter()!);
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter()!);
    }
  }

  return (
    <>
      <div
        id="mapWrapper"
        style={{
          height: "calc(100vh - 120px)",
          boxSizing: "border-box",
          paddingBottom: 60,
          paddingTop: 58,
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Fab
          sx={{ position: "fixed", bottom: 70, left: 10, zIndex: 100 }}
          color="primary"
          aria-label="Lokasi Saya"
          id="fabMap"
          onClick={handleClickCurrentLocation}
        >
          <MyLocationIcon />
        </Fab>
      </div>
    </>
  );
}
