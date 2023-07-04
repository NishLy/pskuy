import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import getBase64 from "@/lib/getBase64";
import Joystick from "@/models/joystick";
import Console from "@/models/console";

import trpc from "@/utils/trpc";
import { ROOM_DATA } from "@/interfaces/room";
import { useRouter } from "next/dist/client/router";
import Loading from "@/pages/(__components)/loading";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import SuperJSON from "superjson";
import createTRPCContext from "@/pages/api/trpc/context";
import Unauthorized from "@/pages/(__components)/unauthorized";
import useAuth from "@/hooks/useAuth";

/**
 * The above function is a TypeScript React function that uses the getServerSideProps method to fetch
 * data for a specific room based on the provided context.
 * @param context - The `context` parameter is an object that contains information about the
 * server-side rendering context. It includes properties such as `req` (the incoming HTTP request
 * object), `res` (the outgoing HTTP response object), `query` (an object containing the query
 * parameters), and more.
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    id: string;
    id_owner: string;
    id_rental: string;
  }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: SuperJSON,
  });

  await helpers.findOneRoom.prefetch({
    id: parseInt(context.query.id as string),
    id_rental: parseInt(context.query.id_rental as string),
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        id: parseInt(context.query.id as string),
        id_rental: parseInt(context.query.id_rental as string),
        id_owner: context.query.id_owner,
        trpcState: helpers.dehydrate(),
      })
    ),
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!useAuth()) return <Unauthorized />;
  const router = useRouter();
  const { data: dataConsoles } = trpc.showAllConsole.useQuery({});
  const { data: dataJoysticks } = trpc.showAllJoystick.useQuery({});

  const [roomData, setRoomData] = React.useState<ROOM_DATA>({
    console_production_year: 1970,
    id_console: "",
    id_joystick_first_person: null,
    id_joystick_second_person: null,
    id_rental: parseInt(router.query.id as string),
    information: "",
    status: "good",
    room_images: undefined,
    price_per_hour: -1,
  });

  const [images, setImages] = React.useState<{
    existed: string[];
    new: string[];
  }>();
  const [upload, setUpload] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const imageFileElement = React.useRef<HTMLInputElement>(null);

  /* The above code is making a query using the `findOneRoom` RPC (Remote Procedure Call) with the
  provided `id` and `id_rental` parameters. It sets the `refetchOnWindowFocus` option to `true`,
  which means the query will be automatically refetched when the window regains focus. */
  trpc.findOneRoom.useQuery(
    {
      id: props.id,
      id_rental: props.id_rental,
    },
    {
      refetchOnWindowFocus: true,
      onSuccess(data) {
        setLoading(false);
        setRoomData(data.room as ROOM_DATA);
      },
      onError() {
        setLoading(false);
      },
    }
  );

  /* The above code is using the `useQuery` hook from the `trpc` library in a TypeScript React
  application. */
  trpc.editRoom.useQuery(
    { ...roomData, id: parseInt(router.query.id as string) },
    {
      enabled: upload,
      onSuccess(data) {
        handleFileUpload(data.id as number);
      },
    }
  );

  /**
   * The function `handleFileUpload` is used to upload image files and update a room's information.
   * @param {number} id - The `id` parameter is a number that represents the ID of a rental.
   */
  const handleFileUpload = async (id: number) => {
    const files = imageFileElement?.current?.files;

    const data = new FormData();
    Array.from(files ?? []).forEach((e) => {
      data.append(e.name, e);
    });
    data.set("id", id.toString());
    data.set("changed", id.toString());
    fetch("/api/upload/images/edit-room", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        res.ok ? router.push("/manage/rental/" + props.id_rental) : null;
      })
      .catch((err) => {
        if (err) throw new Error(err);
      });

    router.push("/manage/rental/" + props.id_rental);
  };

  /**
   * The handleSubmit function prevents the default form submission behavior and sets the upload state
   * to true.
   * @param event - The event parameter is of type React.FormEvent<HTMLFormElement>. It represents the
   * form submission event that triggered the handleSubmit function.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpload(true);
  };

  /**
   * The handleImageClick function is used to trigger a click event on an image file input element.
   */
  const handleImageClick = async () => {
    imageFileElement.current?.click();
  };

  /**
   * The function handles the change event of an image input element, retrieves the selected image
   * files, converts them to base64 strings, and updates the state with the new images.
   * @returns The function `handleImageChange` is returning nothing (i.e., `undefined`).
   */
  async function handleImageChange() {
    if (!imageFileElement.current) return;
    const fileImages = imageFileElement?.current.files;
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
   * The function handles the change of an image in a carousel by updating the state of the images and
   * room data.
   * @param {string} src - The `src` parameter is a string that represents the source of an image.
   */
  function handleImageCourselChange(src: string) {
    setImages({
      existed: images?.existed?.filter((e) => e !== src) ?? [],
      new: images?.new ?? [],
    });
    setRoomData({
      ...roomData,
      room_images:
        roomData.room_images
          ?.split(",")
          .filter((e) => e !== src)
          .toString() ?? roomData.room_images,
    });
  }

  /* The above code is defining a function called `handleRoomDataChange` that is used to handle
  changes in input fields in a form. It takes an event object as an argument, which represents the
  change event triggered by the user. */
  const handleRoomDataChange = (
    evt: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    switch (evt.currentTarget.getAttribute("name")) {
      case "price":
        setRoomData({
          ...roomData,
          price_per_hour: parseInt(evt.currentTarget.value),
        });
        break;
      case "production":
        setRoomData({
          ...roomData,
          console_production_year: parseInt(evt.currentTarget.value),
        });
        break;
      case "information":
        setRoomData({
          ...roomData,
          information: evt.currentTarget.value,
        });
        break;
      case "condition":
        setRoomData({
          ...roomData,
          status: evt.currentTarget.value,
        });
        break;
    }
  };

  /**
   * The function `handleSelectChange` is used to update the `roomData` state based on the selected
   * value of different dropdown menus.
   * @param {SelectChangeEvent} evt - The parameter "evt" is an event object that is passed to the
   * function when the select element's value is changed. It contains information about the event, such
   * as the target element (the select element that triggered the event) and the new value selected.
   */
  function handleSelectChange(evt: SelectChangeEvent) {
    switch (evt.target.name) {
      case "joystick1":
        setRoomData({
          ...roomData,
          id_joystick_first_person: evt.target.value,
        });
        break;
      case "joystick2":
        setRoomData({
          ...roomData,
          id_joystick_second_person: evt.target.value,
        });
        break;
      case "console":
        setRoomData({
          ...roomData,
          id_console: evt.target.value,
        });
        break;
    }
  }

  /**
   * The function returns an array of strings that contains both existing and new room images.
   * @returns an array of strings.
   */
  function getArrayOfImages(): string[] {
    if (!images) {
      if (roomData.room_images) {
        setImages({
          existed: roomData.room_images?.split(",") ?? [],
          new: [],
        });
      }
    }
    return [...(images?.existed ?? []), ...(images?.new ?? [])];
  }

  return (
    <>
      {loading && <Loading />}
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" component="h1" color="white" mt={2}>
          Input data Ruangan
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ImageCoursel
            controlled={{
              onImageDelete: handleImageCourselChange,
              setter: handleImageClick,
            }}
            images={getArrayOfImages()}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <input
              hidden
              name="images"
              type="file"
              ref={imageFileElement}
              onChange={handleImageChange}
              multiple
              accept="image/png, image/gif, image/jpeg"
            />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="price"
                  required
                  fullWidth
                  label="Harga rental perjam"
                  autoFocus
                  onChange={handleRoomDataChange}
                  type="number"
                  placeholder="Eg: Rp. 5.000"
                  value={roomData.price_per_hour}
                  inputProps={{ min: 1000 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Jenis konsole
                  </InputLabel>
                  <Select
                    value={roomData?.id_console}
                    fullWidth
                    label="Tipe console"
                    name="console"
                    onChange={handleSelectChange}
                  >
                    {dataConsoles &&
                      (dataConsoles.consoles as Console[]).map((data, i) => (
                        <MenuItem key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Controller 1</InputLabel>
                  <Select
                    value={roomData?.id_joystick_first_person as string}
                    fullWidth
                    label="Joystick 1"
                    name="joystick1"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={undefined}>Tidak ada</MenuItem>
                    {dataJoysticks &&
                      (dataJoysticks.joysticks as Joystick[]).map((data, i) => (
                        <MenuItem key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Controller 2</InputLabel>
                  <Select
                    value={roomData?.id_joystick_second_person as string}
                    fullWidth
                    label="Joystick 2"
                    name="joystick2"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={undefined}>Tidak ada</MenuItem>
                    {dataJoysticks &&
                      (dataJoysticks.joysticks as Joystick[]).map((data, i) => (
                        <MenuItem key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="production"
                  required
                  fullWidth
                  placeholder="2023"
                  type="number"
                  inputProps={{
                    min: 1970,
                    max: 2023,
                    minLength: 4,
                    maxLength: 4,
                  }}
                  onChange={handleRoomDataChange}
                  label="Tahun Produksi"
                  value={roomData?.console_production_year}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Kondisi</InputLabel>
                  <Select
                    fullWidth
                    label="Joystick 1"
                    name="condition"
                    onChange={handleSelectChange}
                    value={roomData?.status}
                  >
                    <MenuItem selected value="good">
                      Baik
                    </MenuItem>
                    <MenuItem value="useable">Minus</MenuItem>
                    <MenuItem value="unuseable">Rusak</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="information"
                  required
                  fullWidth
                  label="Deskripsi"
                  placeholder="Eg: HDD 1TB FAT, Game terinstal - > GTA V, PES 2023..."
                  autoFocus
                  onChange={handleRoomDataChange}
                  multiline
                  value={roomData?.information}
                  rows={4}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2, mb: 2, paddingY: 2 }}
            >
              Update Data Ruangan
            </Button>
          </Box>
        </Box>
      </Container>
      <Stack spacing={2} sx={{ width: "100%" }}></Stack>
    </>
  );
}
