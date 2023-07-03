/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Fab } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { renderToString } from "react-dom/server";
import trpc from "@/utils/trpc";
import Rental from "@/models/rental";
import RENTAL_DATA from "@/interfaces/rental";
import Image from "next/image";
import { ERROR_IMAGE_PATH } from "@/static/path";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "../(__components)/unauthorized";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { InferGetStaticPropsType } from "next";
import { appRouter } from "../api/trpc/[trpc]";
import SuperJSON from "superjson";
import Link from "next/link";
import { useRouter } from "next/router";

const defaultProps = {
  center: {
    lat: -6.888701,
    lng: 109.668289,
  },
  zoom: 15,
};

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      uuid: undefined,
      username: undefined,
      user_type: undefined,
      email: undefined,
      profile_photo: undefined,
      token: undefined,
    },
    transformer: SuperJSON,
  });
  await helpers.showAllRental.prefetch({ parameters: {}, limit: false });
  return {
    props: JSON.parse(
      JSON.stringify({
        trpcState: helpers.dehydrate(),
      })
    ),
    revalidate: 1,
  };
}

export default function Page(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  if (!useAuth()) return <Unauthorized />;
  const router = useRouter();
  const mapRef = React.useRef();
  let map: google.maps.Map;

  const { data, isSuccess } = trpc.showAllRental.useQuery({
    parameters: {},
    limit: false,
  });

  React.useEffect(() => {
    async function initMap(): Promise<void> {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      map = new Map(
        mapRef.current ??
          (document.querySelector("#mapWrapper")! as HTMLElement),
        router.query.lat && router.query.lng
          ? {
              ...defaultProps,
              center: {
                lat: parseInt(router.query.lat as string),
                lng: parseInt(router.query.lng as string),
              },
              zoom: 5,
            }
          : defaultProps
      );
      if (data?.rentals) {
        for (let index = 0; index < data.rentals.rows.length; index++) {
          const dataRental = data.rentals.rows[index] as Rental;
          const infoWindow = new google.maps.InfoWindow({
            content: renderToString(infoWindowRental(dataRental)),
            ariaLabel: dataRental.name,
            maxWidth: 500,
          });
          const marker = new google.maps.Marker({
            position: {
              lat: dataRental.latitude,
              lng: dataRental.longitude,
            },
            title: dataRental.name,
            animation: google.maps.Animation.DROP,
            icon: "/images/maps/pskuy_marker.png",
            map,
          });

          marker.addListener("click", () => {
            map.setZoom(12);
            infoWindow.open({
              anchor: marker,
              map,
            });
          });
        }
      }
    }
    initMap();
  }, [isSuccess]);

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
    const infoWindow = new google.maps.InfoWindow();

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
      ></div>
      <Fab
        sx={{ position: "fixed", bottom: 70, left: 10, zIndex: 10000 }}
        color="primary"
        aria-label="Lokasi Saya"
        id="fabMap"
        onClick={handleClickCurrentLocation}
      >
        <MyLocationIcon />
      </Fab>
    </>
  );
}

export function infoWindowRental(props: RENTAL_DATA) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Image
        src={props.rental_images?.split(",")[0] ?? ERROR_IMAGE_PATH}
        height="100"
        width="200"
        loading="lazy"
        style={{ aspectRatio: "16/9", objectFit: "cover" }}
        alt={props.name}
      />
      <div style={{ marginTop: 5 }}>
        <h2 style={{ margin: 0 }}>{props.name}</h2>
        <p>{props.address}</p>
        <Link href={"/view/rental/" + props.id}>Lihat Rental</Link>
      </div>
    </div>
  );
}
