/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Container, Fab } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { ScriptProps } from "next/script";
import { renderToString } from "react-dom/server";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markerOnChange: (prop: any) => void;
  };
} & ScriptProps;

export default function MapSelect(props: Props) {
  const mapRef = React.useRef();
  const [loaded, setLoaded] = React.useState(false);
  const map = React.useMemo<google.maps.Map | undefined>(
    () =>
      loaded
        ? new window.google.maps.Map(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mapRef.current ?? document.querySelector("#mapWrapper")!,
            defaultProps
          )
        : undefined,
    [loaded]
  );

  const infoWindow = React.useMemo<google.maps.InfoWindow | undefined>(
    () =>
      loaded
        ? new google.maps.InfoWindow({
            content: renderToString(infoWindowRental()),
          })
        : undefined,
    [loaded]
  );

  const [position, setPosition] = React.useState<
    google.maps.LatLng | null | undefined
  >(
    new google.maps.LatLng({
      lat: -6.888701,
      lng: 109.668289,
    })
  );

  React.useEffect(() => {
    setLoaded(true);
    return () => {
      document
        .querySelector("#confirmationButton")
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ?.removeEventListener("click", () => {});
    };
  }, []);

  function getPosition() {
    console.log(position);
    return position;
  }

  document
    .querySelector("#confirmationButton")
    ?.addEventListener("click", () => {
      props.controlled?.markerOnChange(getPosition());
    });

  React.useEffect(() => {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        infoWindow?.open({
          anchor: marker,
          map,
        });

        setPosition(marker.getPosition());

        map?.setCenter(marker.getPosition()!);
      });
  }, [map]);

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

          infoWindow?.setPosition(pos);
          console.log(pos);

          setPosition(new google.maps.LatLng(pos));
          infoWindow?.open(map);
          map?.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow!, map!.getCenter()!);
        }
      );
    } else {
      handleLocationError(false, infoWindow!, map!.getCenter()!);
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
        ></Container>
        <Fab
          sx={{ position: "fixed", bottom: 20, left: 20 }}
          color="primary"
          aria-label="Lokasi Saya"
          onClick={handleClickCurrentLocation}
        >
          <MyLocationIcon />
        </Fab>
      </Container>
    </>
  );
}

export function infoWindowRental() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div>
        Pilih lokasi ini?
        <button
          style={{
            padding: 10,
            border: "none",
            borderRadius: 5,
            color: "white",
            marginRight: 10,
            width: "100%",
            marginTop: 10,
            backgroundColor: "#94d3a2",
          }}
          id="confirmationButton"
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
