import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ImageCoursel from "@/pages/__components/image_coursel";
import getBase64 from "@/lib/getBase64";
import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import Joystick from "@/models/joystick";
import Console from "@/models/console";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import trpc from "@/utils/trpc";
import { ROOM_DATA } from "@/interfaces/room";
import AppContext from "@/context/app";
import { useRouter } from "next/dist/client/router";
import Room from "@/models/room";

interface ServerSideProps {
  uuid: string;
  Consoles: Console[];
  Joysticks: Joystick[];
}

interface redirect {
  redirect: {
    destination: string;
    permanent: boolean;
  };
}

// export async function getStaticProps(
//   context: GetStaticPropsContext<{ id: string }>
// ) {
//   // if (!(await verifyToken(ctx.req.cookies.token))) return redirectLogin();

//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       uuid: undefined,
//       username: undefined,
//       user_type: undefined,
//       email: undefined,
//       profile_photo: undefined,
//       token: undefined,
//     },
//     transformer: superjson, // optional - adds superjson serialization
//   });

//   // if (!ctx.req.cookies.token) return redirectLogin();
//   // if (!(await findOwnerRecord(ctx.req.cookies.uuid ?? "")))
//   // return redirectLogin();

//   // await helpers.getOwner.prefetch({
//   //   id: ctx.req.cookies.uuid ?? "",
//   // });

//   await helpers.showAllConsole.prefetch({});
//   await helpers.showAllJoystick.prefetch({});

//   // const consoles = await showAllConsole({}).catch((err) => redirectLogin());
//   // const joysticks = await showJoystick({}).catch((err) => redirectLogin());
//   // console.log(consoles, "console");
//   return {
//     props: JSON.parse(
//       JSON.stringify({
//         // uuid: ctx.req.cookies.uuid,
//         // consoles,
//         // joysticks,
//         trpcState: helpers.dehydrate(),
//       })
//     ),
//   };
// }

export default function Page() {
  // props: InferGetServerSidePropsType<typeof getStaticProps>
  // console.log(props);
  const router = useRouter();
  const [useContext] = React.useContext(AppContext);

  console.log(useContext);
  const { data: dataConsoles } = trpc.showAllConsole.useQuery({});
  const { data: dataJoysticks } = trpc.showAllJoystick.useQuery({});

  // console.log(data);
  const [roomData, setRoomData] = React.useState<ROOM_DATA>({
    console_production_year: 1970,
    id_console: "",
    id_joystick_first_person: null,
    id_joystick_second_person: null,
    id_rental: -1,
    information: "",
    status: "good",
    price_per_hour: -1,
  });

  const [images, setImages] = React.useState<string[]>([]);
  const [upload, setUpload] = React.useState<boolean>(false);
  const imageFileElement = React.useRef<HTMLInputElement>(null);

  trpc.createRoom.useQuery(roomData, {
    enabled: upload,
    onSuccess(data: { room: Room }) {
      handleFileUpload(data.room?.id as number);
    },
  });

  const handleFileUpload = async (id: number) => {
    const file = imageFileElement?.current?.files![0];
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
          res.ok ? router.push("/manages/rental/" + router.query.slug) : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataLiteral: ROOM_DATA = {
      ...roomData,
      id_console: data.get("console")?.toString() ?? "",
      id_rental: parseInt(router.query.slug?.toString() ?? "0"),
      console_production_year: parseInt(
        data.get("production")?.toString() ?? "1970"
      ),
      id_joystick_first_person: data.get("joystick1")?.toString() ?? null,
      id_joystick_second_person: data.get("joystick1")?.toString() ?? null,
      information: data.get("information")?.toString() ?? "",
      status: data.get("condition")?.toString() ?? "",
      price_per_hour: parseInt(data.get("price")?.toString() ?? "0"),
    };
    setRoomData(dataLiteral);
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

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" component="h1">
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
                  type="number"
                  placeholder="Eg: Rp. 5.000"
                  inputProps={{ min: 1000 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Jenis konsole
                  </InputLabel>
                  <Select fullWidth label="Tipe console" name="console">
                    {dataConsoles &&
                      (dataConsoles.consoles as Console[]).map((data, i) => (
                        <MenuItem selected={i === 0} key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Controller 1
                  </InputLabel>
                  <Select fullWidth label="Joystick 1" name="joystick1">
                    <MenuItem>Tidak ada</MenuItem>
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
                  <InputLabel id="demo-simple-select-label">
                    Controller 2
                  </InputLabel>
                  <Select fullWidth label="Joystick 1" name="joystick2">
                    <MenuItem>Tidak ada</MenuItem>
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
                  label="Tahun Produksi"
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Kondisi</InputLabel>
                  <Select fullWidth label="Joystick 1" name="condition">
                    <MenuItem selected value="good">
                      Baik
                    </MenuItem>
                    <MenuItem value="useable">Minus</MenuItem>
                    <MenuItem value="unuseable">Rusak</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="information"
                  required
                  fullWidth
                  label="Deskripsi"
                  placeholder="Eg: HDD 1TB FAT, Game terinstal - > GTA V, PES 2023..."
                  autoFocus
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Daftarkan Ruangan
            </Button>
          </Box>
        </Box>
      </Container>
      <Stack spacing={2} sx={{ width: "100%" }}></Stack>
    </>
  );
}
