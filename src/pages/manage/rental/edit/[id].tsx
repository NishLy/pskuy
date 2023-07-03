import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import client from "@/utils/trpc";
import { useRouter } from "next/router";
import { Alert, Avatar, Backdrop, Snackbar, Link } from "@mui/material";
import getBase64 from "@/lib/getBase64";
import RENTAL_DATA from "@/interfaces/rental";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import Loading from "@/pages/(__components)/loading";
import MapSelect from "@/pages/(__components)/map_selector";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import createTRPCContext from "@/pages/api/trpc/context";
import SuperJSON from "superjson";
import { findOneRentalRecord } from "@/services/rental";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "@/pages/(__components)/unauthorized";

/**
 * This function is used to fetch rental data from the server and prepare it for rendering in a React
 * component.
 * @param context - The `context` parameter is an object that contains information about the
 * server-side rendering context. It includes properties such as `query` which contains the query
 * parameters from the URL, and `req` and `res` which are the incoming request and outgoing response
 * objects respectively.
 * @returns an object with the following properties:
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string; id_owner: string }>
) {
  const rental = await findOneRentalRecord({
    id: parseInt(context.query.id as string),
    id_owner: context.query.id_owner as string,
  }).catch();

  if (!rental) {
    return {
      redirect: {
        permanent: false,
        destination: ("/manage/rental/" + context.query.id) as string,
      },
      props: {},
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: SuperJSON,
  });

  await helpers.findOneRentalProtected.prefetch({
    id: parseInt(context.query.id as string),
    id_owner: context.query.id_owner as string,
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        trpcState: helpers.dehydrate(),
        id: parseInt(context.query.id as string),
        id_owner: context.query.id_owner as string,
      })
    ),
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!useAuth()) return <Unauthorized />;

  const router = useRouter();

  const [updateData, setUpdateData] = React.useState<
    RENTAL_DATA & { id: number }
  >({
    address: "",
    description: "",
    id_owner: router.query.id_owner as string,
    latitude: 0,
    longitude: 0,
    name: "",
    rental_images: "",
    rental_logo: "",
    id: parseInt((router.query.id as string) ?? "-1"),
  });
  const [images, setImages] = React.useState<{
    existed: string[];
    new: string[];
  }>();
  const [openMap, setOpenMap] = React.useState(false);
  const [logoImages, setLogoImages] = React.useState<
    { existed: string | undefined; new: string | undefined } | undefined
  >();
  const [update, setUpadate] = React.useState(false);
  const [rentalData, setRentalData] = React.useState({
    address: "",
    description: "",
    latitude: 0,
    longitude: 0,
    name: "",
  });

  const imagesElement = React.useRef<HTMLInputElement>(null);
  const imageLogoElement = React.useRef<HTMLInputElement>(null);

  /* Using the `useQuery` hook from the `client` object to fetch data for a specific rental using the
`findOneRental` method. It passes an object with `id` and `id_owner` properties as parameters to the
method. It also provides an `onError` callback function to handle any errors that may occur during
the query. The hook returns an object with `data` and `error` properties that can be used to render
the UI based on the query status. */
  const { data, error } = client.findOneRentalProtected.useQuery(
    {
      id: parseInt(props.id),
      id_owner: props.id_owner,
    },
    {
      onError(data) {
        console.log(data);
      },
    }
  );

  const dataFecthRental = data?.rental as RENTAL_DATA;

  /* The above code is using the `useQuery` hook from the `editRental` client to fetch data and update it
based on the `update` state. The `updateData` parameter is the query to be executed. The `enabled`
parameter is set to `update` to enable the query when the `update` state is true. The
`refetchOnWindowFocus` and `refetchOnReconnect` parameters are set to false to prevent automatic
refetching of data. The `onSuccess` function is called when the query is successful, which sets the
`update` */
  client.editRental.useQuery(updateData, {
    enabled: update,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess() {
      setUpadate(false);
      handleFileUpload(dataFecthRental?.id ?? -1);
    },
    onError() {
      setUpadate(false);
    },
  });

  /**
   * The function handles a click event on an images element.
   */
  const handleImagesClick = async () => {
    imagesElement.current?.click();
  };

  /**
   * The function handles a click event on an image logo element.
   */
  const handleLogoClick = async () => {
    imageLogoElement.current?.click();
  };

  /**
   * This function handles file uploads for rental images and logo image using FormData and sends a POST
   * request to the server.
   * @param {number} id - a number representing the ID of a rental property
   */
  const handleFileUpload = (id: number) => {
    const files = imagesElement?.current?.files;
    const logo_file = imageLogoElement.current?.files?.[0];
    if (
      images?.existed.toString() !== dataFecthRental.rental_images ||
      !logoImages?.existed
    ) {
      const data = new FormData();
      Array.from(files ?? []).forEach((e) => {
        data.append(e.name, e);
      });
      if (logo_file) data.set("logo_image", logo_file);

      data.set("id", id.toString() ?? "");
      data.set("changed", id.toString() ?? "");

      fetch("/api/upload/images/edit-rental", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          res.ok ? router.push("/manage/rental") : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
    // router.push("/manage/rental");
  };

  /**
   * This function handles form submission and updates state with the form data.
   * @param event - The event parameter is a React.FormEvent<HTMLFormElement> type, which represents the
   * event that is triggered when a form is submitted.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdateData({
      ...updateData,
      address: rentalData.address,
      description: rentalData.description,
      latitude: rentalData.latitude,
      longitude: rentalData.longitude,
      name: rentalData.name,
      rental_images: images
        ? images.existed.toString()
        : (dataFecthRental.rental_images as string),
      rental_logo: logoImages?.new
        ? (dataFecthRental.rental_logo as string)
        : (dataFecthRental.rental_logo as string),
    });
    setUpadate(true);
  };

  /**
   * This function handles changes in a form input and updates the corresponding state in a React
   * component.
   * @param event - A React ChangeEvent that can be either an HTMLInputElement or an
   * HTMLTextAreaElement.
   * @param {string} input - a string representing the input field being changed (e.g. "address",
   * "name", "description", "latitude", or "longitude")
   * @returns This is a function that takes in two parameters: an event of type
   * React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> and a string called input. The function
   * then checks if the current target of the event is truthy, and if not, it returns nothing. If the
   * current target is truthy, the function uses a switch statement to determine which property of the
   * rentalData object to update based on the
   */
  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    input: string
  ) {
    if (!event.currentTarget) return;
    switch (input) {
      case "address":
        setRentalData({ ...rentalData, address: event.currentTarget.value });
        break;
      case "name":
        setRentalData({ ...rentalData, name: event.currentTarget.value });
        break;
      case "description":
        setRentalData({
          ...rentalData,
          description: event.currentTarget.value,
        });
        break;
      case "latitude":
        setRentalData({
          ...rentalData,
          latitude: parseInt(event.currentTarget.value),
        });
        break;
      case "longitude":
        setRentalData({
          ...rentalData,
          longitude: parseInt(event.currentTarget.value),
        });
        break;
    }
  }

  /**
   * This function handles the change event of an input element that allows the user to select multiple
   * image files, converts each file to a base64 string, and adds them to an array of images.
   * @returns The function `handleImageChange` is an asynchronous function that does not return anything
   * explicitly. However, it does contain several conditional statements that may cause the function to
   * exit early and not execute the rest of the code.
   */
  async function handleImageChange() {
    if (!imagesElement.current) return;
    const fileImages = imagesElement?.current.files;
    if (!fileImages) return;
    const arr: string[] = [];
    Array.from(fileImages).map(async (e: File) => {
      getBase64(e).then((res) => {
        arr.push(res as string);
        setImages({ existed: images?.existed ?? [], new: [...arr] });
      });
    });
  }

  /**
   * This function handles the change event for a logo image input element and sets the base64 encoded
   * image as state.
   * @returns If `imageLogoElement.current` is falsy or if `fileImages` is falsy, then `undefined` is
   * being returned. Otherwise, the function is setting the state of `logoImages` to the base64 string
   * representation of the selected file.
   */
  async function handleLogoChange() {
    if (!imageLogoElement.current) return;
    const fileImages = imageLogoElement.current?.files?.[0];
    if (!fileImages) return;
    setLogoImages({
      existed: undefined,
      new: (await getBase64(fileImages)) as string,
    });
  }

  /**
   * This function returns an array of strings representing images, fetched from dataFecthRental or an
   * empty array if there are no images.
   * @returns an array of strings, which is the `images` array.
   */
  function getArrayOfImages(): string[] {
    if (!images) {
      if (dataFecthRental) {
        setImages({
          existed: dataFecthRental.rental_images?.split(",") ?? [],
          new: [],
        });
      }
    }
    return [...(images?.existed ?? []), ...(images?.new ?? [])];
  }

  /**
   * The function returns a logo image from either a pre-existing array or from a data fetch.
   * @returns The function `getLogoImage()` returns the value of `logoImages` if it exists, otherwise it
   * returns the value of `dataFecthRental.rental_logo` if `dataFecthRental` is truthy. If neither
   * `logoImages` nor `dataFecthRental.rental_logo` exist, `undefined` will be returned.
   */
  function getLogoImage() {
    if (!logoImages) {
      if (dataFecthRental)
        setLogoImages({
          existed: dataFecthRental.rental_logo ?? undefined,
          new: undefined,
        });
    }
    return logoImages?.new ? logoImages.new : logoImages?.existed;
  }

  /**
   * The function updates the position and closes the map.
   * @param latlng - google.maps.LatLng object, which represents a geographical point with latitude and
   * longitude coordinates.
   */
  function handlePostionChange(latlng: google.maps.LatLng) {
    setRentalData({
      ...rentalData,
      latitude: latlng.lat(),
      longitude: latlng.lng(),
    });
    setOpenMap(false);
  }

  function handleImageCourselChange(src: string) {
    setImages({
      existed: images?.existed?.filter((e) => e !== src) ?? [],
      new: images?.new ?? [],
    });
  }

  /* The above code is using the `useEffect` hook in a React component to update the state of
`rentalData` based on the value of `dataFecthRental`. If `dataFecthRental` is truthy, it sets the
`name`, `address`, `description`, `latitude`, and `longitude` properties of `rentalData` to the
corresponding values in `dataFecthRental`. This effect will be triggered whenever `dataFecthRental`
changes. */
  React.useEffect(() => {
    if (dataFecthRental) {
      setRentalData({
        name: dataFecthRental.name,
        address: dataFecthRental.address,
        description: dataFecthRental.description,
        latitude: dataFecthRental.latitude,
        longitude: dataFecthRental.longitude,
      });
    }
  }, [dataFecthRental]);

  return (
    <>
      {update && <Loading />}
      {openMap && (
        <MapSelect
          moveable={true}
          controlled={{ markerOnChange: handlePostionChange }}
        />
      )}
      <Container
        component="main"
        maxWidth="xs"
        sx={{ backgroundColor: "background.paper" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Data Rental
          </Typography>
          <Avatar sx={{ height: 80, width: 80 }} src={getLogoImage()}></Avatar>
          <Button onClick={handleLogoClick}>edit logo</Button>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography component="h1" variant="body2" mb={1}>
              Upload foto usaha rentalmu
            </Typography>
            <input
              hidden
              name="images"
              type="file"
              ref={imagesElement}
              onChange={handleImageChange}
              multiple
              accept="image/png, image/gif, image/jpeg"
            />
            <input
              hidden
              name="image_logo"
              type="file"
              ref={imageLogoElement}
              onChange={handleLogoChange}
              accept="image/png, image/gif, image/jpeg"
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ImageCoursel
                  controlled={{
                    onImageDelete: handleImageCourselChange,
                    setter: handleImagesClick,
                  }}
                  images={getArrayOfImages()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                  value={rentalData.name}
                  onChange={(e) => handleFormChange(e, "name")}
                  id="name"
                  label="Nama Rental"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Deskripsi toko"
                  onChange={(e) => handleFormChange(e, "description")}
                  name="description"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={rentalData.description}
                  multiline
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Alamat toko rental"
                  onChange={(e) => handleFormChange(e, "address")}
                  name="address"
                  rows={2}
                  value={rentalData.address}
                  multiline
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12}>
                <Link onClick={() => setOpenMap(true)}>
                  Pilih posisi usaha anda
                </Link>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="latitude"
                  name="latitude"
                  required
                  disabled
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="latitude"
                  onChange={(e) => handleFormChange(e, "latitude")}
                  label="Latitude"
                  value={rentalData.latitude}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="longitude"
                  name="longitude"
                  required
                  fullWidth
                  onChange={(e) => handleFormChange(e, "longitude")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                  value={rentalData.longitude}
                  id="longitude"
                  label="Longitude"
                  autoFocus
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Rental
            </Button>
          </Box>
        </Box>
      </Container>
      {error && (
        <Backdrop open={!!error}>
          <Snackbar open={true} autoHideDuration={6000} sx={{ zIndex: 50 }}>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error.data?.code}
            </Alert>
          </Snackbar>
        </Backdrop>
      )}
    </>
  );
}
