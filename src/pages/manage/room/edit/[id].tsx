import * as React from "react";
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
import ImageCoursel from "@/pages/__components/image_coursel";
import getBase64 from "@/lib/getBase64";
import Joystick from "@/models/joystick";
import Console from "@/models/console";

import trpc from "@/utils/trpc";
import { ROOM_DATA } from "@/interfaces/room";
import { useRouter } from "next/dist/client/router";
import Room from "@/models/room";
import Loading from "@/pages/__components/loading";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import SuperJSON from "superjson";
import createContext from "@/pages/api/trpc/context";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    id: string;
    id_owner: string;
    id_rental: string;
  }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: SuperJSON,
  });

  await helpers.findOneRoom.prefetch({
    id: parseInt(context.query.id as string),
    id_rental: parseInt(context.query.id_rental as string),
  });

  console.log("selesai di");

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
    price_per_hour: -1,
  });

  const [images, setImages] = React.useState<string[]>([]);
  const [upload, setUpload] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const imageFileElement = React.useRef<HTMLInputElement>(null);

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
        setImages(
          (data.room as ROOM_DATA).images_directory?.split(",") ?? images
        );
      },
      onError(err) {
        console.log(err.data);
        setLoading(false);
      },
    }
  );

  trpc.editRoom.useQuery(
    { ...roomData, id: parseInt(router.query.id as string) },
    {
      enabled: upload,
      onSuccess(data: { room: Room }) {
        console.log(data);
        handleFileUpload(data.room?.id as number);
      },
      onError(data) {
        console.log(data.data);
      },
    }
  );

  const handleFileUpload = async (id: number) => {
    const file = imageFileElement?.current?.files?.[0];
    if (file) {
      const data = new FormData();
      data.set("image", file);
      data.set("id", id.toString());

      fetch("/api/upload/images/room", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          console.log(res);
          res.ok ? router.push("/manage/rental/" + props.id_rental) : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
    router.push("/manage/rental/" + props.id_rental);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpload(true);
  };

  const handleImageSelected = async () => {
    imageFileElement.current?.click();
  };

  const handleImageChange = () => {
    const image = imageFileElement.current?.files;
    if (!image) return;
    Array.from(image).map(async (e: File) => {
      setImages([...images, (await getBase64(e)) as string]);
    });
    document
      .querySelector("#imageCoursel")
      ?.scrollBy({ left: -140, behavior: "smooth" });
  };

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
          price_per_hour: parseInt(evt.currentTarget.value),
        });
        break;
      case "information":
        setRoomData({
          ...roomData,
          id_console: evt.currentTarget.value,
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

  function handleSelectChange(evt: SelectChangeEvent) {
    console.log(evt);
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
            controlled={{ setState: setImages, setter: handleImageSelected }}
            images={images}
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
