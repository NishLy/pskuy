import React from "react";
import { Container, Fab } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { ScriptProps } from "next/script";

const defaultProps: google.maps.MapOptions = {
  center: {
    lat: -6.888701,
    lng: 109.668289,
  },
  zoom: 15,
  gestureHandling: "greedy",
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
    markerOnChange: (prop: any) => void;
  };
} & ScriptProps;

export default function MapSelect(props: Props) {
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
        props.controlled &&
          props.controlled.markerOnChange(marker.getPosition());
      });
    // return google.maps.event.removeListener(listener);
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
      <Container
        sx={{
          height: "100vh",
          width: "100vw",
          zIndex: 50,
          top: 0,
          left: 0,
          padding: 0,
          position: "fixed",
        }}
      >
        <Container
          id="mapWrapper"
          sx={{
            height: "100vh",
            width: "100vw",
          }}
        >
          <Fab
            //   sx={{ position: "absolute", bottom: 70, left: 10 }}
            color="primary"
            aria-label="Lokasi Saya"
            onClick={handleClickCurrentLocation}
          >
            <MyLocationIcon />
          </Fab>
        </Container>
      </Container>
    </>
  );
}
